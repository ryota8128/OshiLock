# 認証実装タスク

## 概要
Apple Sign In + Google Sign In を実装し、ログイン画面を実際に動くようにする。

## 技術選定

| 項目 | 選定 |
|---|---|
| Apple Sign In | `expo-apple-authentication` |
| Google Sign In | `expo-auth-session` + Google OAuth |
| トークン管理 | `expo-secure-store` |
| 状態管理 | React Context |

## 実装手順

### Phase 1: Expo 設定 & ライブラリ導入

1. 必要なライブラリをインストール
   ```
   npx expo install expo-apple-authentication expo-auth-session expo-crypto expo-secure-store
   ```

2. `app.json` に Apple Sign In のプラグイン設定を追加
   ```json
   {
     "plugins": ["expo-router", "expo-apple-authentication"]
   }
   ```

3. Google OAuth のクライアントID取得
   - Google Cloud Console でプロジェクト作成
   - OAuth 2.0 クライアントID（iOS）を作成
   - `.env` にクライアントIDを保存

### Phase 2: 認証コンテキスト作成

4. `apps/mobile/contexts/AuthContext.tsx` を作成
   - `user: User | null` 状態
   - `signInWithApple()` / `signInWithGoogle()` / `signOut()` メソッド
   - トークンを `SecureStore` に保存・読み込み
   - アプリ起動時にトークン確認 → 自動ログイン

### Phase 3: Apple Sign In 実装

5. Apple Sign In のフロー実装
   - `AppleAuthentication.signInAsync()` で identityToken を取得
   - BE の `/auth/apple` に identityToken を送信
   - BE で Apple の公開鍵で検証 → JWT 発行
   - JWT を SecureStore に保存

### Phase 4: Google Sign In 実装

6. Google Sign In のフロー実装
   - `AuthSession.useAuthRequest()` で OAuth フロー
   - BE の `/auth/google` に code を送信
   - BE で Google の tokeninfo API で検証 → JWT 発行
   - JWT を SecureStore に保存

### Phase 5: BE 認証エンドポイント

7. `apps/be-api/src/routes/auth.ts` を作成
   - `POST /auth/apple` — Apple identityToken 検証 → JWT 発行
   - `POST /auth/google` — Google code 検証 → JWT 発行
   - JWT 署名用の秘密鍵を環境変数で管理

8. ユーザー作成/取得ロジック
   - Apple/Google の sub (ユーザーID) で User を検索
   - 初回ログイン → User 作成
   - 2回目以降 → 既存 User を返す

### Phase 6: 画面連携

9. ルートレイアウトで認証状態に応じた画面切替
   - 未認証 → `/login` にリダイレクト
   - 認証済み → `/(tabs)` を表示

10. ログイン画面のボタンを実際の認証フローに接続

11. マイページのログアウトボタンで `signOut()` 呼び出し

### Phase 7: テスト & 確認

12. Expo Go で Apple Sign In 動作確認
    - ※ Apple Sign In は Expo Go では動かない → Development Build が必要
    - `npx expo run:ios` で実機ビルド or EAS Build

13. Google Sign In 動作確認

## 注意点

- Apple Sign In は **Expo Go では動作しない**（Development Build が必要）
- Google Sign In は Expo Go でも `expo-auth-session` 経由で動く
- MVP では JWT のリフレッシュトークンは省略可（有効期限長めに設定）
- Apple はメールアドレスを初回のみ返す（2回目以降は null）→ 初回で保存必須

## 依存関係

- BE API のエンドポイントが必要（Phase 5）
- DynamoDB の User テーブル設計が必要（Phase 5 の前に必要）
- → まず Mobile 側（Phase 1〜4）を先に進め、BE はモック API で繋ぐ

## ファイル構成（予定）

```
apps/mobile/
  contexts/
    AuthContext.tsx        ← 認証状態管理
  app/
    _layout.tsx            ← 認証状態で画面切替
    login.tsx              ← 既存を拡張

apps/be-api/
  src/
    routes/
      auth.ts              ← 認証エンドポイント
    middleware/
      jwt.ts               ← JWT 検証ミドルウェア
```
