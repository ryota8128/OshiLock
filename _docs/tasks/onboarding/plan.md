# オンボーディング（表示名 + アバター設定）

## 概要

初回ログイン（`isNewUser: true`）時に表示名とアバターを設定する画面。

## 画像管理方針

### インフラ構成

```
アップロード:
  Mobile → BE (S3 presigned URL 発行) → Mobile → S3 (直接アップロード)

表示:
  Mobile → CloudFront (signed URL) → S3

BE → S3:
  dev: AWS Profile (SSO)
  stg/prod: Vercel OIDC → AssumeRole
```

### S3 + CloudFront 構成

- S3: **private**（直接アクセス不可）
- CloudFront: OAC で S3 にアクセス
- CloudFront signed URL で画像表示（公開鍵/秘密鍵ペア）
- **キャッシュキーはパスのみ**（署名パラメータはキャッシュキーに含めない）
- 署名の検証は必須

```
パス構成:
  /avatars/{userId}/{filename}
  /images/{eventId}/{filename}     ← 将来のコメント画像等
```

### 画像アップロードフロー

```
1. Mobile → BE: POST /upload/presigned-url { path, contentType }
2. BE: S3 presigned URL を生成（有効期限 5分）
3. BE → Mobile: { uploadUrl, cdnPath }
4. Mobile: 画像リサイズ → presigned URL に PUT
5. Mobile → BE: プロフィール更新（avatarUrl = cdnPath）
```

### 画像表示フロー

```
1. BE → Mobile: ユーザー情報（avatarUrl = "/avatars/u_xxx/abc.jpg"）
2. Mobile: CloudFront signed URL を生成 or BE から取得
3. Mobile → CloudFront: signed URL でアクセス
4. CloudFront: 署名検証 → キャッシュチェック（キー = パスのみ）→ S3 から取得
```

## Terraform リソース

### modules/storage（新規）
- S3 バケット（private）
- CloudFront ディストリビューション（OAC + signed URL）
- CloudFront Key Group（公開鍵）
- Cache Policy（署名パラメータをキャッシュキーから除外）

### modules/vercel-oidc-role（既存を参考に作成）
- IAM Role（Vercel OIDC → AssumeRole）
- DynamoDB + S3 の権限ポリシー

### 環境ごと
- dev: S3 + CloudFront のみ（OIDC 不要、SSO でアクセス）
- stg/prod: S3 + CloudFront + Vercel OIDC Role

## 実装手順

### Phase 1: Terraform（S3 + CloudFront）
1. `infra/modules/storage/` を作成
2. dev 環境に apply

### Phase 2: BE エンドポイント
3. `POST /upload/presigned-url` — presigned URL 発行
4. `PUT /users/me/profile` — 表示名 + avatarUrl 更新

### Phase 3: Mobile オンボーディング画面
5. `app/onboarding.tsx` — 表示名入力 + アバター写真選択
6. `components/Avatar.tsx` — signed URL 画像 / イニシャルフォールバック
7. `_layout.tsx` — `isNewUser: true` → `/onboarding` にリダイレクト

## ファイル構成

```
infra/
  modules/
    storage/              ← S3 + CloudFront
    vercel-oidc-role/     ← Vercel → AWS 認証

apps/mobile/
  app/
    onboarding.tsx
  components/
    Avatar.tsx

apps/be-api/
  presentation/routes/
    upload/
      upload.controller.ts
      upload-request.schema.ts
    user/
      user.controller.ts
      user-request.schema.ts
  application/use-cases/
    upload/
      create-presigned-url.ts
    user/
      update-profile.ts
  infrastructure/
    s3/
      client.ts
      storage.gateway.ts
  domain/
    gateway/
      storage.gateway.interface.ts
```
