# BE アーキテクチャ ガイドライン

## ディレクトリ構成（軽量 DDD / Clean Architecture）

```
apps/be-api/src/
  index.ts                  ← エントリポイント（Hono app + エラーハンドラー + ルートマウント）
  config/
    env.ts                  ← 環境変数の zod バリデーション（IS_LOCAL で local/remote 分岐）
  composition/
    dependencies.ts         ← DI composition root（全インスタンスの生成・組み立て）
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
      auth/
        sign-in.ts          ← クラスベース、コンストラクタで依存注入
  domain/
    errors/
      oshilock-be.exception.ts   ← ベース例外
      validation.exception.ts    ← バリデーション例外
    gateway/
      auth.gateway.interface.ts  ← 外部認証サービスの interface
    repository/
      user.repository.interface.ts ← DB アクセスの interface
    services/
  infrastructure/
    dynamo/
      client.ts
      entity/
        user.db.ts
      repository/
        user.repository.ts       ← IUserRepository の実装
    firebase/
      client.ts
      auth.gateway.ts            ← IAuthGateway の実装
```

## レイヤー間の依存ルール

```
presentation → composition → application → domain
                                         ← infrastructure (implements domain interfaces)
```

- `presentation/` は `composition/` から use-case を取得して呼ぶ
- `composition/` は infrastructure のインスタンスを生成し、use-case に注入する（DI composition root）
- `application/` は `domain/` の interface のみに依存する（infrastructure を直接 import しない）
- `domain/` は外部依存なし（DB、HTTP、フレームワークを知らない。zod は許容）
- `infrastructure/` は `domain/` の interface を実装する

## 命名規約

| 種類 | ファイル名 | 例 |
|---|---|---|
| コントローラー | `<リソース名>.controller.ts` | `auth.controller.ts`, `events.controller.ts` |
| リクエストスキーマ | `<リソース名>-request.schema.ts` | `auth-request.schema.ts` |
| ユースケース | `<動詞>-<名詞>.ts` | `sign-in.ts`, `create-event.ts` |
| DB エンティティ | `<モデル名>.db.ts` | `user.db.ts`, `event-info.db.ts` |
| リポジトリ実装 | `<モデル名>.repository.ts` | `user.repository.ts` |
| リポジトリ interface | `<モデル名>.repository.interface.ts` | `user.repository.interface.ts` |
| Gateway 実装 | `<名前>.gateway.ts` | `auth.gateway.ts` |
| Gateway interface | `<名前>.gateway.interface.ts` | `auth.gateway.interface.ts` |
| ドメインサービス | `<名詞>-service.ts` | `rank-service.ts` |
| 例外 | `<名前>.exception.ts` | `validation.exception.ts` |
| DI composition | `dependencies.ts` | `dependencies.ts` |

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
    const result = await signInUseCase.execute(idToken);
    return c.json(result);
  },
);

// ❌ コントローラー内で手動バリデーションしない
auth.post("/signin", async (c) => {
  const { idToken } = await c.req.json();
  if (!idToken) return c.json({ error: "required" }, 400);
});
```

## DI（依存注入）

### 方針

- **DI コンテナは使わない**（過剰）
- `composition/dependencies.ts` を唯一の composition root とする
- infrastructure のインスタンス生成（`new`）はここだけで行う
- use-case はクラスベースで、コンストラクタで依存を受け取る
- application 層は domain の interface のみに依存する

### ルール

```typescript
// ✅ composition root で組み立て
// composition/dependencies.ts
const authGateway = new FirebaseAuthGateway();
const userRepository = new DynamoUserRepository();
export const signInUseCase = new SignInUseCase(authGateway, userRepository);

// ✅ controller は composition root から use-case を取得
import { signInUseCase } from "../../../composition/dependencies.js";
const result = await signInUseCase.execute(idToken);

// ✅ use-case は interface に依存
class SignInUseCase {
  constructor(
    private readonly authGateway: IAuthGateway,
    private readonly userRepository: IUserRepository,
  ) {}
}

// ❌ controller で直接 new しない
const repo = new DynamoUserRepository();

// ❌ application 層で infrastructure を import しない
import { DynamoUserRepository } from "../infrastructure/...";

// ❌ infrastructure ファイル内で export const instance = new Class() しない
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
