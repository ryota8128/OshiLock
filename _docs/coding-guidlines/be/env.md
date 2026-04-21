# BE 環境変数

- `config/env.ts` で zod バリデーション
- `IS_LOCAL` で local / remote のスキーマを分岐（union 型）
- local: `AWS_PROFILE`, `FIREBASE_SERVICE_ACCOUNT_PATH` が必須
- remote: `AWS_ROLE_ARN`, `FIREBASE_SERVICE_ACCOUNT_JSON` が必須
- default 値は安全なもの（`AWS_REGION` 等）のみ許可。`PORT` 等はデフォルトなし
