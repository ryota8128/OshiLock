# OshiLock 作業ログ

> 重要な意思決定・進捗を記録する。古い情報はサマライズして圧縮する。

---

## 2026-04-18

### プロジェクト初期状態
- リポジトリ作成済み（2コミット）
- 要件定義ドキュメント完成（概要.md, 機能詳細.md）
- マーケティング資料作成済み（x-post関連）
- **コード実装はまだ未着手**

### UI/UXデザイン方針決定
- **デザインツール**: Claude Design（2026/4/17リリース）を使用。ハンドオフバンドルでClaude Codeに連携
- **タイムライン画面**:
  - グループ切替: 下線アクティブ（X/Threads風）
  - フィルタ: 排他切替（すべて/未読/イベント/メディア/SNS/ニュース/グッズ）
  - セクション構成: 見逃し注意（48H以内、横スクロール）→ 今日・明日 → 今週 → 新着
  - 未読: セクション内で未読→既読の順。未読ドット+太字、既読は薄く表示
- **カテゴリ（5種）**: イベント(ピンク) / グッズ(オレンジ) / メディア(パープル) / SNS(スカイブルー) / ニュース(グレー)
- **情報確度判定**: ホワイトリスト一致+200→◎ / ホワイトリスト+404→△ / 不一致URL→○ / URLなし→△
- **AI処理**: 1回のAPI呼び出しで5処理（カテゴリ判定、重複チェック、URL一致度、カード生成、通知タイミング）
- **SNS Share**: カード詳細画面から共有ボタン、OS標準シェアシート、アプリリンク付き

### モノレポ・API セットアップ（前回）
- pnpm + Turborepo モノレポ構成構築
- `apps/be-api`: Hono API（port 3012、`/` `/health` エンドポイント）
- `packages/shared`: 共有型定義（Card, CardCategory, SourceReliability）
- pnpm catalog でバージョン一元管理
- コーディングガイドライン作成（`_docs/coding-guidlines/`）

### Expo モバイルアプリ セットアップ
- `apps/mobile` に Expo SDK 54 + tabs テンプレートで作成
- Expo Router 6（ファイルベースルーティング）採用
- `@oshilock/mobile` として pnpm ワークスペースに統合
- `@oshilock/shared` を依存に追加
- app.json: name=OshiLock, slug=oshilock, scheme=oshilock に設定
- **Tailscale 経由で Expo Go 実機確認成功**
- 開発コマンドを README.md / CLAUDE.md に記載

## 2026-04-19

### ドメインモデル設計

**型定義（packages/shared）:**
- Branded Types: `EventId`, `UserId`, `OshiId`, `CommentId`, `PostId`
- 日付型: `UtcIsoString`, `DateString`, `TimeString`（parse/now/変換関数付き）
- ドメインモデル: `EventInfo`, `User`, `Oshi`, `Comment`, `Post`, `Check`, `UserSettings`, `UserPushToken`, `EventReport`, `CommentReport`
- enum: `EventCategory`, `SourceReliability`, `UserRank`, `ReportCategory`, `Platform`
- `EventInfoWithUserContext`（EventInfo + `isRead`, `checked`）をドメイン層に定義

**重要な設計判断:**
- `EventCard` → `EventInfo` にリネーム（UIの「カード」とドメインの「情報」を分離）
- 「気になる」→「チェック」に名称変更（ブックマークアイコン）
- `Favorite` → `Check` モデルにリネーム
- ユーザー固有データ（`isRead`, `checked`）は `EventInfoWithUserContext` で拡張
- `urgent`/`countdown` は型に持たず、UIコンポーネント内で計算
- Branded Type に `as string` キャストは不要（コーディング規約に追加）
- API レスポンスはドメインモデルをそのまま返す方針
- Vercel プラグインをプロジェクトレベルで無効化（`.claude/settings.json`）

### モバイルUI実装

**完成した画面（8画面）:**
1. **ホーム** — カバー率プログレスバー + 要チェック + 今日の予定
2. **タイムライン** — タブ型グループ切替（B案）+ 排他フィルタ
3. **チェック** — チェック済みカード一覧
4. **マイページ** — プロフィール + ランク + 統計 + 設定 + ログアウト
5. **イベント詳細** — バッジ + タイトル + チェックボタン + 日時 + 詳細 + ソース（アプリ内ブラウザ）+ 最速TOP3 + コメント
6. **投稿フォーム** — FABからモーダルで開く、テキスト + URL入力
7. **ログイン** — ロゴ + Apple/Google ボタン
8. **404** — Not Found

**コンポーネント・インフラ:**
- `EventCardItem` — カードC案（上帯カテゴリ）、Lucideアイコン、日付/カウントダウン表示
- デザイントークン（`constants/theme.ts`）
- モックデータ（`data/mock.ts`）— 今日・明日のイベント含む8件
- SafeArea 対応（全画面）
- FAB（右下 + ボタン、全タブ共通）
- シェア機能（iOS シェアシート）
- ソースURL（アプリ内ブラウザ `expo-web-browser`）
- 画面遷移: カードタップ → 詳細、ログアウト → ログイン、ログイン → ホーム

### 次のステップ
- 認証実装（Apple Sign In + Google Sign In）
- BE API 設計
- DynamoDB 設計
