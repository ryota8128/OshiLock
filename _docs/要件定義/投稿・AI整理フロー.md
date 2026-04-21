# 投稿・AI整理フロー

## 概要

ユーザーの投稿（テキスト + URL）を受け取り、AIが自動で解析・分類・既存カードとの統合を行う。
投稿は即レスポンスし、カード処理は SQS FIFO で推しグループ単位に直列化してバックグラウンド実行する。

---

## 全体フロー

```
ユーザーが投稿（テキスト + URL）
  ↓
POST /posts → 投稿を DynamoDB に保存 → 即レスポンス
  ↓ waitUntil でバックグラウンド処理開始
  ↓
[並列処理] パース（投稿ごとに独立、複数投稿を並列実行可）
  ↓
1. URL 処理
   - 本文中の URL も正規表現で抽出（URL欄と同じ扱い）
   - URL合計 最大3件（重複除去後）
   - X の URL → ソース参照リンクとして保存のみ（fetch しない）
   - X 以外の URL → fetch してテキスト抽出（HTML除去、先頭2000〜3000文字）
  ↓
2. [AI 1回目] パース（構造化抽出）
   - input: 投稿テキスト + URL fetch結果
   - output（structured）: title, category, date, summary, sourceReliability
  ↓
3. パース結果を SQS FIFO に送信（MessageGroupId = グループID）
  ↓
====== ここから直列処理（SQS FIFO でグループ単位に直列化）======
  ↓
EventBridge Pipes が SQS からメッセージを取り出し → Vercel 内部 API を呼び出し
  ↓
4. URL 事前判定（AI 不要）
   - 投稿の URL を正規化して DynamoDB GSI で既存カード検索
   - 一致あり → duplicate（AI スキップ、確度UP + 貢献ポイント付与）
   - 一致なし → 次へ
  ↓
5. サマリの前処理（JS、AI 不要）
   - S3 からサマリファイル取得
   - 終了済みカードを除外（endDate or startDate < 24時間前）
   - 日付フィルタ: 投稿の startDate ± 1週間 に重なるカード + date null のカードだけ残す
   - → AI に渡すトークンを削減
  ↓
6. [AI 2回目] 被り判定
   - input: パース結果 + フィルタ済みサマリ
   - output（structured）: matchedCardId, matchType(new / duplicate / related)
  ↓
7. 分岐
   - new → 新規カード生成（パース結果をそのまま保存）
   - duplicate → カード生成しない。確度UP + 貢献ポイント付与
   - related → [AI 3回目] マージ実行
  ↓
8. [AI 3回目 / related のみ] マージ
   - input: 既存カード詳細 + 新投稿のパース結果
   - output（structured）: 更新後のカード内容
  ↓
9. DynamoDB 保存 + S3 サマリファイル更新（フィルタ済みデータ + 新規/更新分）
  ↓
10. Vercel API が 2xx を返す → SQS がメッセージ削除 → 次のメッセージを配信
```

---

## インフラ構成

### 非同期キュー: SQS FIFO + EventBridge Pipes

```
[Vercel Functions]                    [AWS]
  POST /posts                         SQS FIFO キュー
    → 投稿保存                           ↓
    → waitUntil でパース              EventBridge Pipes（ポーリング）
    → SQS に送信 ──────────→            ↓
                                    Vercel 内部 API を HTTP 呼び出し
  POST /internal/process-card ←────
    → 被り判定                       ← 2xx で完了 → メッセージ削除 → 次へ
    → カード生成/マージ              ← 失敗 → メッセージ再表示 → リトライ
    → S3 更新
```

### SQS FIFO の直列化

- `MessageGroupId` にグループ（推し）ID を設定
- 同じグループの投稿は直列処理（前の処理が完了するまで次が配信されない）
- 異なるグループの投稿は並列処理
- Visibility Timeout: 60秒（Vercel Functions の処理時間に合わせる）

### 直列化の仕組み

1. EventBridge Pipes が SQS からメッセージを取り出す
2. メッセージは「非表示」状態になる（Visibility Timeout）
3. Vercel API を呼び出し、レスポンスを待つ
4. 2xx → メッセージ削除 → 次のメッセージを配信
5. 失敗 → Visibility Timeout 経過後にメッセージが再表示 → リトライ

### コスト

| サービス | 料金 |
|---|---|
| SQS FIFO | 月100万リクエスト無料枠、以降 $0.35/100万 |
| EventBridge Pipes | $0.40/100万リクエスト |
| → MVP規模（月数千リクエスト）ではほぼ無料 |

### なぜこの構成か

- **SQS FIFO** — グループ単位の直列化が `MessageGroupId` で簡単に実現できる
- **EventBridge Pipes** — Lambda 不要、SQS → HTTP の中継だけ。コードを Vercel に統一できる
- **DynamoDB Streams ではない理由** — グループ単位の直列化が難しい（同時実行数1にすると全グループが直列になる）
- **Lambda 中継ではない理由** — EventBridge Pipes で十分。Lambda を挟む意味が薄い

### 想定反映速度

- パース（並列）: 1〜3秒
- SQS + EventBridge Pipes のオーバーヘッド: 〜1秒
- 被り判定 + カード処理: 1〜3秒
- **合計: 3〜7秒**

---

## URL の扱い

### URL 取得元

- URL入力欄（最大3件）
- 本文テキストから正規表現で抽出（URL欄と合わせて重複除去、合計最大3件）

### URL 種別ごとの処理

| URL 種別 | 処理 |
|---|---|
| X (twitter.com / x.com) | ソース参照リンクとして保存のみ。fetch しない（OGP が取れない + API はコスト高） |
| その他の URL | fetch → HTML除去 → テキスト抽出 → AI に渡す |

### URL 正規化（重複判定用）

投稿の URL を正規化して DynamoDB に `normalizedUrl` として保存。GSI で既存カードと一致判定する。

**正規化ルール:**
- `http` → `https` に統一
- `www.` を除去
- 末尾スラッシュを除去
- 既知のトラッキングパラメータのみ除去: `utm_*`, `fbclid`, `gclid`, `ref`
- それ以外のクエリパラメータは保持（`?id=123` 等は意味があるため）
- フラグメント（`#section`）は除去

**方針: 安全寄り（誤一致を防ぐ）**
- 見逃し（同じページなのに別 URL 判定）は AI の被り判定がフォールバックする
- 誤一致（別ページを同一判定）は情報ロスになるため避ける

### テキスト抽出

- cheerio 等で HTML パース
- `<script>`, `<style>`, ナビゲーション等を除去
- 本文テキストのみ抽出
- 先頭 2000〜3000文字に切り詰め（トークンコスト制御）

---

## AI 処理

### モデル構成

- 全ステップ nano/flash 級の軽量モデルを使用
- プロバイダー・モデルは切り替え可能な抽象層で実装
- 検証でモデル比較し、コスト効率ベストを選定
- 全ステップ structured output 必須

### 1回目: パース（構造化抽出）

**input:** 投稿テキスト + URL fetch結果 + 現在日時（プロンプトに含める）
**output:**

```typescript
{
  title: string;                        // イベントタイトル
  category: EventCategory;              // event | media | sns | news
  startDate: DateString | null;         // 開始日（YYYY-MM-DD）
  startTime: TimeString | null;         // 開始時刻（HH:mm）or null
  endDate: DateString | null;           // 終了日 or null（同日・単日なら null）
  endTime: TimeString | null;           // 終了時刻 or null
  summary: string;                      // 1行サマリ（サマリファイル用）
  sourceReliability: 'official' | 'unconfirmed'; // URL有=official, 無=unconfirmed
}
```

**パースルール:**
- 日付と時刻は分離して保存（DateString / TimeString は既存の value object を使用）
- 「今夜」「明日」等の相対表現 → プロンプトに含めた現在日時から絶対日付に変換
- startDate と endDate が同日 → ロジック側で endDate = null に正規化
- タイムゾーンは MVP では保存しない（日本のイベントのみ、JST 固定で表示）

### 2回目: 被り判定

**input:** 1回目のパース結果 + 既存カードサマリ（TOON形式、S3から取得）
**output:**

```typescript
{
  matchedCardId: string | null;         // 既存カードID or null
  matchType: 'new' | 'duplicate' | 'related';
}
```

### 3回目: マージ（related の場合のみ）

**input:** 既存カード詳細 + 新投稿のパース結果
**output:** 更新後のカード内容（structured output）

---

## 被り判定用サマリファイル

### 形式

S3 に TOON（Token-Oriented Object Notation）形式で保存。
LLM 特化フォーマットで、JSON/YAML 比 30〜60% トークン削減。

```
@id cat startDate startTime endDate endTime title
evt_001 event 2026-07-20 null 2026-07-22 null 夏フェス 東京ガーデンシアター
evt_002 event 2026-06-01 10:00 2026-06-15 23:59 チケット先行
evt_003 media 2026-07-05 22:00 null null ミュージックステーション出演
evt_004 sns null null null null メンバー卒業発表
```

### 管理

- 1グループ1ファイル
- カード生成/更新時にサマリファイルも更新
- AI の被り判定時に S3 から1回の GET で取得
- **endDate の正規化** — AI が startDate と endDate を同日で返した場合、ロジック側で endDate = null に正規化（1日完結のイベントは endDate 不要）
- **終了済みカードの除外** — 被り判定の前に JS で filter（300件程度なので1ms以下）。除外後のデータで被り判定し、結果を S3 に PUT（自動クリーンアップ、バッチ不要）
  - endDate あり → endDate + 24時間経過で除外
  - endDate なし、startDate あり → startDate + 24時間経過で除外
  - 両方 null → 作成から30日経過で除外
- 想定サイズ: 1グループ 100〜300件、約30KB（AI トークンで約10,000）

---

## 最速投稿者 & 貢献ポイント

### 最速投稿者

- 新規カード生成時、投稿者を最速1位として記録
- duplicate 判定時、既存カードの最速リスト（最大3名）に追加

### 貢献ポイント

- 全投稿者（new / duplicate / related）に貢献ポイントを付与
- ポイントのロジックは非公開
- ランク制度の判定に使用

### ポイント計算（コードベース、AI 不要）

| 判定 | 条件 | ポイント |
|---|---|---|
| new | 新規カード生成 | 10点 |
| duplicate | 初回投稿から 0〜5分以内 | 3点 |
| duplicate | 初回投稿から 5〜20分以内 | 1点 |
| duplicate | 初回投稿から 20分以降 | 0点 |
| related | マージで date が埋まった | +5点 |
| related | マージで URL が追加された | +3点 |
| related | マージで description に追記された | +2点 |

- 閾値はコード側で定数化し、後から調整可能
- related の貢献度はマージ前後のカードフィールド差分で判定（AI 不要）

---

## 投稿制限

| 制限 | 内容 |
|---|---|
| 投稿上限 | 1日3件まで |
| クールダウン | 投稿後5分間は次の投稿不可 |

---

## 情報の信頼性

| 条件 | 確度 |
|---|---|
| 公式ソースの URL 付き | ◎（公式確認済み） |
| 複数人が同じ情報を投稿（duplicate） | ○（確度UP） |
| 1人だけ + ソースなし | △（未確認情報ラベル） |

---

## 未決定事項

- [ ] 3回目マージ時に既存カードのどの情報を渡すか（全フィールド or サマリ）
- [ ] 投稿制限の実装方法（DynamoDB カウンター等）
- [ ] fetch 失敗時のフォールバック（リトライ or テキストのみで判定）
- [ ] AI のプロンプト設計（各ステップの具体的なプロンプト）
- [ ] イベントカードの詳細データモデル（DynamoDB スキーマ）
- [ ] グループ機能との連携（MVP は1グループ固定？）
- [ ] EventBridge Pipes → Vercel 内部 API の認証方法（API キー等）
