# BE アーキテクチャ ガイドライン

## ディレクトリ構成（軽量 DDD / Clean Architecture）

```
apps/be-api/src/
  index.ts                  ← エントリポイント（Hono app + エラーハンドラー + ルートマウント）
  config/
    env.ts                  ← 環境変数の zod バリデーション（IS_LOCAL で local/remote 分岐）
  presentation/
    middleware/
      validate.ts           ← リクエストバリデーション（query + body を zod でパース）
      error-handler.ts      ← 例外キャッチ → JSON レスポンス
    routes/
      health.controller.ts
      auth/
        auth.controller.ts
        auth-request.schema.ts
  application/
    use-cases/
      sign-in.ts
  domain/
    errors/
      oshilock-be.exception.ts   ← ベース例外
      validation.exception.ts    ← バリデーション例外
    services/
  infrastructure/
    dynamo/
      client.ts
      entity/
        user.db.ts
      repository/
        user.repository.ts
    firebase/
      client.ts
```

## レイヤー間の依存ルール

```
presentation → application → domain
                           → infrastructure
```

- `presentation/` は `application/` のみ呼ぶ
- `application/` は `domain/` と `infrastructure/` を使う
- `domain/` は外部依存なし（DB、HTTP、フレームワークを知らない。zod は許容）
- `infrastructure/` は `domain/` のインターフェースを実装する

## 命名規約

| 種類 | ファイル名 | 例 |
|---|---|---|
| コントローラー | `<リソース名>.controller.ts` | `auth.controller.ts`, `events.controller.ts` |
| リクエストスキーマ | `<リソース名>-request.schema.ts` | `auth-request.schema.ts` |
| ユースケース | `<動詞>-<名詞>.ts` | `sign-in.ts`, `create-event.ts` |
| DB エンティティ | `<モデル名>.db.ts` | `user.db.ts`, `event-info.db.ts` |
| リポジトリ | `<モデル名>.repository.ts` | `user.repository.ts` |
| ドメインサービス | `<名詞>-service.ts` | `rank-service.ts` |
| 例外 | `<名前>.exception.ts` | `validation.exception.ts` |

## import 方針

- **shared パッケージ**: `@oshilock/shared` から一括 import（re-export あり）
- **BE 内部**: 直接ファイルを import（re-export の index.ts は作らない）
- **ESM**: import パスには `.js` 拡張子を付ける

```typescript
// ✅ BE 内部は直接 import
import { UserEntity } from "../infrastructure/dynamo/entity/user.db.js";

// ❌ index.ts 経由にしない
import { UserEntity } from "../infrastructure/dynamo/entity/index.js";
```

## リクエストバリデーション

`validate()` ミドルウェアを使い、zod スキーマで query / body をパースする。
コントローラー内で手動バリデーションしない。

```typescript
// ✅ validate ミドルウェアを使う
import { validate } from "../../middleware/validate.js";
import { signInRequestSchema } from "./auth-request.schema.js";

auth.post(
  "/signin",
  validate({ body: signInRequestSchema }),
  async (c) => {
    const { idToken } = c.get("validated"); // 型安全
    const result = await signIn(idToken);
    return c.json(result);
  },
);

// ❌ コントローラー内で手動バリデーションしない
auth.post("/signin", async (c) => {
  const { idToken } = await c.req.json();
  if (!idToken) return c.json({ error: "required" }, 400);
});
```

### リクエストスキーマ

各ルートの `<リソース名>-request.schema.ts` に zod スキーマを定義する。

```typescript
// auth-request.schema.ts
import { z } from "zod";

export const signInRequestSchema = z.object({
  idToken: z.string().min(1),
});
```

## エラーハンドリング

### 例外クラス

- `OshiLockBeException` — ベース例外。`statusCode` + `message` + `toJSON()`
- `ValidationException extends OshiLockBeException` — zod のフィールドエラーを `details` に含む
- 新しいエラー種別は `OshiLockBeException` を継承して `domain/errors/` に追加する

### エラーレスポンス形式

```json
{
  "error": "ValidationException",
  "statusCode": 400,
  "message": "Validation failed: idToken",
  "details": {
    "idToken": ["String must contain at least 1 character(s)"]
  }
}
```

### エラーハンドラー

`app.onError(errorHandler)` で全ルート共通のエラーハンドリング。
- `OshiLockBeException`: `toJSON()` をレスポンスとして返す
- その他: 500 エラーを返す

コントローラーで try-catch は不要（エラーハンドラーが処理する）。

## ElectroDB エンティティ

- `infrastructure/dynamo/entity/` に配置
- ファイル名は `<モデル名>.db.ts`
- enum の type は `Object.values(定数)` で定義する

```typescript
// ✅ 正しい
import { AUTH_PROVIDER } from "@oshilock/shared";
type: Object.values(AUTH_PROVIDER),

// ❌ リテラルで書かない
type: ["APPLE", "GOOGLE"] as const,
```

## 環境変数

- `config/env.ts` で zod バリデーション
- `IS_LOCAL` で local / remote のスキーマを分岐（union 型）
- local: `AWS_PROFILE`, `FIREBASE_SERVICE_ACCOUNT_PATH` が必須
- remote: `AWS_ROLE_ARN`, `FIREBASE_SERVICE_ACCOUNT_JSON` が必須
- default 値は安全なもの（`AWS_REGION` 等）のみ許可。`PORT` 等はデフォルトなし
