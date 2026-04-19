# WLフォーム → Google Spreadsheet 連携

## 概要
LPのウェイトリストフォームの送信データをGoogle Spreadsheetに書き込む。
Next.jsのServer Actionから直接Google Sheets APIを叩く。

## 構成

```
LP (Next.js)
  Client: フォーム送信
    ↓ Server Action
  Server: Google Sheets API → スプシに行追加
```

## データ

| カラム | 型 | 必須 |
|--------|------|------|
| email | string | ○ |
| oshi | string | ○ |
| sns | string | - |
| registeredAt | ISO8601 | 自動 |

## 手順

### Step 1: Google側のセットアップ（手動）
- Google Cloud Projectでサービスアカウント作成
- Google Sheets API を有効化
- サービスアカウントのJSONキーをダウンロード
- スプシを作成し、ヘッダー行（email, oshi, sns, registeredAt）を入れる
- サービスアカウントのメールを編集者として共有
- スプシIDと認証情報を `apps/lp/.env.local` に設定

### Step 2: Server Action + Sheets API実装
- `googleapis` パッケージを `@oshilock/lp` に追加
- `src/app/actions/waitlist.ts` — Server Action
  - zodでバリデーション（email, oshi必須, sns任意）
  - Sheets APIでスプシに行追加
  - 成功/失敗レスポンス返却
- `src/lib/google-sheets.ts` — Sheets APIクライアント初期化

### Step 3: LP側のフォーム送信を修正
- `src/components/waitlist-section.tsx`
  - Server Actionを呼び出す形に変更
  - ローディング状態・エラーハンドリング追加

## 環境変数（apps/lp/.env.local）

```
GOOGLE_SHEETS_PRIVATE_KEY=...
GOOGLE_SHEETS_CLIENT_EMAIL=...
GOOGLE_SHEETS_SPREADSHEET_ID=...
```

## 備考
- be-apiは経由しない（be-apiはDynamoDB用）
- サービスアカウントの認証情報は `.env.local` で管理（gitにコミットしない）
- 本番デプロイ時はVercelの環境変数に設定
- クーポンコード送信はリリース時に別タスクで対応
