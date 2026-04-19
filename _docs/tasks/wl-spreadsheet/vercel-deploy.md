# LP Vercelデプロイ手順

## 前提
- モノレポ（pnpm workspace + Turborepo）
- デプロイ対象: `apps/lp`（Next.js）
- `apps/lp` の変更のみでビルドトリガーしたい

## 手順

### Step 1: Vercelプロジェクト作成
1. [Vercel](https://vercel.com) でプロジェクトを新規作成
2. GitHubリポジトリを連携

### Step 2: プロジェクト設定

**General > Root Directory:**
```
apps/lp
```

**Build & Development Settings:**

| 項目 | 値 |
|------|-----|
| Framework Preset | Next.js（自動検出） |
| Install Command | `cd ../.. && pnpm install` |
| Build Command | `cd ../.. && turbo build --filter=@oshilock/lp` |
| Output Directory | `.next`（デフォルト） |

**Git > Ignored Build Step:**
```
git diff --quiet HEAD^ HEAD -- apps/lp/ packages/
```
→ `apps/lp/` と `packages/` の変更がある時だけビルド実行

### Step 3: 環境変数設定

**Settings > Environment Variables** で以下を追加:

| 変数名 | 値 | Environment |
|--------|-----|-------------|
| `GOOGLE_SHEETS_CLIENT_EMAIL` | JSONキーの `client_email` | Production |
| `GOOGLE_SHEETS_PRIVATE_KEY` | JSONキーの `private_key`（そのままペースト） | Production |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | `15ygqPLqmas5IiDILoqvJP_29ZeNcXATnM8AjxtFNv5E` | Production |

> **注意:** `NEXT_PUBLIC_` プレフィックスは絶対につけない（サーバーサイドのみで使用）

### Step 4: デプロイ
1. mainブランチにマージ or プッシュ
2. Vercelが自動でビルド・デプロイ

### Step 5: 動作確認
1. デプロイされたURLでLPを開く
2. WLフォームからテスト送信
3. スプシにデータが入ることを確認

### Step 6: 完了後
- JSONキーファイルを削除: `rm /Users/ryotasato/Downloads/oshilock-9e9798289e85.json`
- カスタムドメイン設定（必要に応じて）
