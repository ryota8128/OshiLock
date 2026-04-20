# OshiLock 作業ログ

> 重要な意思決定・進捗を記録する。古い情報はサマライズして圧縮する。

---

## 2026-04-18〜19（サマリー）

- モノレポ構成（pnpm + Turborepo）、Expo SDK 54 + Hono API セットアップ完了
- Claude Design ワイヤーフレームを元にモバイル UI 8画面実装（ホーム/タイムライン/チェック/マイページ/イベント詳細/投稿フォーム/ログイン/404）
- ドメインモデル設計: Branded Types、日付型、10+ モデル、enum 定義
- 主要な命名変更: EventCard→EventInfo、気になる→チェック、Favorite→Check
- Tailscale 経由で Expo Go 実機確認成功

## 2026-04-20

### 認証基盤

**Firebase Auth:**
- Firebase プロジェクト `OshiLock dev` 作成
- Apple Sign In 有効化
- Firebase Web SDK で Expo Go 互換の認証実装（Development Build 移行時に `@react-native-firebase` に切り替え予定）
- Google Sign In は Development Build 移行時に実装（Apple Developer 登録待ち）
- サービスアカウントキー取得（組織ポリシー変更が必要だった）

**Mobile AuthContext:**
- Firebase `onAuthStateChanged` で認証状態監視 + 自動ログイン復元
- `signInWithApple` 内で BE `/auth/signin` を呼び出し
- BE 登録失敗時は Firebase サインアウト + エラーダイアログ
- Custom Claims 反映後に `getIdToken(true)` で token リフレッシュ

**BE 認証エンドポイント:**
- `POST /auth/signin` — Firebase ID Token 検証 → ユーザー作成/取得
- Custom Claims に `userId` を埋め込み → 以降の API で DB アクセス不要
- 認証ミドルウェア（`authMiddleware`）で `c.get('auth').userId` が型安全に取れる
- public / protected ルートの分離

### BE アーキテクチャ（軽量 DDD / Clean Architecture）

```
src/
  config/env.ts           — 環境変数 zod バリデーション（local/remote 分岐）
  composition/            — DI composition root
  presentation/           — controller + middleware
  application/            — use-case（クラスベース、コンストラクタ DI）
  domain/                 — interface + errors
  infrastructure/         — dynamo + firebase 実装
```

**重要な設計判断:**
- application 層は domain の interface のみに依存（infrastructure を直接 import しない）
- composition root で全インスタンス生成・use-case に注入
- `validate()` ミドルウェアで zod バリデーション共通化
- 例外階層: `OshiLockBeException` → `ValidationException` / `TransactionCanceledException` / `UnauthorizedException`
- BE 内で `throw new Error()` は禁止、必ずカスタム例外
- エラーハンドラー (`app.onError`) で全ルート共通処理

### DynamoDB + Terraform

**インフラ:**
- AWS Organizations で OshiLock 子アカウント作成（ID: 110248914184）
- Terraform bootstrap（S3 state + DynamoDB Lock）
- dev 環境の DynamoDB テーブル `oshilock-dev` 作成
- GSI1, GSI2（KEYS_ONLY）— `aws_dynamodb_global_secondary_index`（experimental）
- `.envrc` で `AWS_PROFILE=oshilock` + TF experiment flag

**ElectroDB:**
- `XxxDb` namespace パターン（`entity` + `Item` 型 + `toDomain` 関数）
- DB → ドメインモデル変換は `from` / `schema.parse`（`as` キャスト禁止）
- トランザクション: `Service` で User + Settings をアトミック作成
- `where notExists` で重複チェック
- GSI クエリは `hydrate: true` 必須

**テスト基盤:**
- testcontainers で DynamoDB Local 自動起動
- `*.test.ts`（UT）と `*.db.test.ts`（DB 統合テスト）の分離
- `pnpm test` / `pnpm test:db` / `pnpm test:all` コマンド
- Repository テスト: CRUD + トランザクション + 重複 + ロールバック 全5テスト通過

### Mobile → BE → DynamoDB E2E 接続成功

- Apple Sign In → Firebase Auth → BE `/auth/signin` → DynamoDB ユーザー作成
- Custom Claims に userId 埋め込み → token リフレッシュ
- fetch ベースの API クライアント（認証ヘッダー自動付与）
- Tailscale 経由で実機確認成功

### Branded Types 強化

- 各型の namespace に `schema`（zod）/ `from` / `generate` を追加
- ID にプレフィックス追加（`u_`, `e_`, `o_`, `c_`, `p_`）
- enum にも `schema` を追加（`AuthProvider.schema`, `UserRank.schema` 等）
- `parse` は `schema.parse()` のラッパーに統一

### コーディング規約 大幅整備

- `_docs/coding-guidlines/be-architecture.md` — DDD 構成、DI、バリデーション、エラーハンドリング、ElectroDB パターン、テスト方針
- `_docs/coding-guidlines/branded-types.md` — `as` 禁止、`from`/`schema` 使い分け、enum schema
- `CLAUDE.local.md` — flowtune-platform 参考実装の参照先一覧

### 次のステップ
- Apple Developer Program 個人登録 → Development Build
- Google Sign In 実装
- オンボーディング画面（表示名設定）
- EventInfo の DynamoDB 設計 + ElectroDB エンティティ
