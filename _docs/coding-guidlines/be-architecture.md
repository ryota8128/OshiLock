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

## API レスポンス型

- レスポンス型は `packages/shared/src/api/response/` に定義する
- BE と Mobile の両方が同じ型を参照する（API 契約を shared で定義）
- controller でレスポンス型を明示的に型注釈して型を強制する

```typescript
// ✅ shared にレスポンス型を定義
// packages/shared/src/api/response/user.response.ts
export type UpdateProfileResponse = {
  user: UserWithAvatarUrl;
};

// ✅ controller で型注釈を付けて型を強制
import type { UpdateProfileResponse } from "@oshilock/shared";

const result = await updateProfileUseCase.execute({ ... });
const response: UpdateProfileResponse = { user: result };
return c.json(response);

// ✅ Mobile で同じ型を参照
import type { UpdateProfileResponse } from "@oshilock/shared";
const res = await apiClient.put<UpdateProfileResponse>("/users/me/profile", body);
```

### バリデーション定数（value-object）

- 文字数制限等のバリデーション定数は `packages/shared/src/domain/value-objects/` に zod schema として定義する
- BE のリクエストスキーマと Mobile のバリデーションで同じ値を使う

```typescript
// ✅ shared に value-object を定義
// packages/shared/src/domain/value-objects/display-name.ts
export namespace DisplayName {
  export const schema = z.string().min(2).max(20);
}

// ✅ BE のリクエストスキーマで使う
import { DisplayName } from "@oshilock/shared";
export const updateProfileRequestSchema = z.object({
  displayName: DisplayName.schema,
});

// ✅ Mobile のバリデーションでも使う
const isValid = DisplayName.schema.safeParse(input).success;
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
- `TransactionCanceledException extends OshiLockBeException` — DynamoDB トランザクション失敗時
- 新しいエラー種別は `OshiLockBeException` を継承して `domain/errors/` に追加する
- **BE 内で `throw new Error()` は禁止。必ずカスタム例外を使う**

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
- `EntityItem<typeof XxxEntity>` でアイテム型を定義し、export する
- `toXxx` マッピング関数を entity ファイルに定義する（ElectroDB の型と密結合のため）

```typescript
// ✅ entity ファイルの構成
import { Entity, type EntityItem } from "electrodb";
import { UserId, AuthProvider, UserRank, UtcIsoString } from "@oshilock/shared";
import type { User } from "@oshilock/shared";

// namespace の外で Entity を生成（namespace 内から参照できないため）
const _entity = new Entity({ ... });

// namespace に entity / Item 型 / マッピング関数をまとめる
export namespace UserDb {
  export const entity = _entity;
  export type Item = EntityItem<typeof _entity>;

  export function toUser(record: Item): User {
    return {
      id: UserId.from(record.userId),
      authProvider: AuthProvider.schema.parse(record.authProvider),
      rank: UserRank.schema.parse(record.rank),
      createdAt: UtcIsoString.from(record.createdAt),
      // ...
    };
  }
}
```

```typescript
// ✅ repository では XxxDb 経由でアクセス
import { UserDb } from "../entity/user.db.js";

// entity へのアクセス
UserDb.entity.query.primary({ userId }).go();
UserDb.entity.create({ ... }).go();

// マッピング
const record = result.data[0];
return record ? UserDb.toUser(record) : null;

// ❌ namespace 外の entity を直接 import しない
import { _entity } from "../entity/user.db.js";

// ❌ repository に手動型定義や as キャストを書かない
type ElectroDBUserRecord = { userId: string; ... };
id: record.userId as UserId,
```

```typescript
// ✅ enum の type は Object.values で定義
import { AUTH_PROVIDER } from "@oshilock/shared";
type: Object.values(AUTH_PROVIDER),

// ❌ リテラルで書かない
type: ["APPLE", "GOOGLE"] as const,
```

## ElectroDB クエリ

### GSI クエリの hydrate

GSI は KEYS_ONLY で定義しているため、GSI 経由のクエリには常に `hydrate: true` を指定する。
primary インデックスのクエリには不要。

```typescript
// ✅ GSI クエリ → hydrate: true
const result = await UserEntity.query.byAuth({ authProvider, authSub }).go({ hydrate: true });

// ✅ primary クエリ → hydrate 不要
const result = await UserEntity.query.primary({ userId }).go();

// ✅ 例外: GSI から key のみ取得したい場合は明示的に hydrate: false
const result = await UserEntity.query.byAuth({ authProvider, authSub }).go({ hydrate: false });
```

### DB → ドメインモデル変換

entity ファイルの `toXxx` 関数で変換する（上記 ElectroDB エンティティのセクション参照）。
repository では `toXxx` を import して使うだけ。

## テスト

### テスト分類

| 種類 | ファイル命名 | 対象 | Docker |
|---|---|---|---|
| ユニットテスト | `*.test.ts` | use-case, domain service 等（mock 使用） | 不要 |
| DB 統合テスト | `*.db.test.ts` | repository 実装（DynamoDB Local） | 必要 |

### コマンド

```bash
pnpm --filter @oshilock/be-api test      # UT のみ
pnpm --filter @oshilock/be-api test:db   # DB テストのみ
pnpm --filter @oshilock/be-api test:all  # 全テスト
```

### Repository テストは必須

Repository はデータ不整合のリスクがあるため、**実装時に必ず DB 統合テストを書く**。

テストすべき項目：
- CRUD 操作（create / findById / findByAuth 等）
- トランザクションのアトミック性（全て書き込まれること）
- 重複チェック（`where notExists` の条件）
- ロールバック（一部失敗時に他の操作も巻き戻ること）
- 存在しないデータの取得（null を返すこと）

```typescript
// ✅ DB テストのファイル名
src/__tests__/dbtest/user.repository.db.test.ts

// ✅ repository の実装クラスを直接テスト
import { DynamoUserRepository } from '../../infrastructure/dynamo/repository/user.repository.js';
const repository = new DynamoUserRepository();

// ❌ entity を直接叩かない（repository の責務を迂回してしまう）
await UserDb.entity.create({ ... }).go();
```

### テスト環境

- DynamoDB Local は testcontainers で自動起動（Docker 必須）
- `.env.test` にテスト用の環境変数を定義
- `global-setup.ts` でコンテナ起動 + テーブル作成
- `beforeEach` で `cleanupTable` を呼びテスト間の独立性を保証

## 環境変数

- `config/env.ts` で zod バリデーション
- `IS_LOCAL` で local / remote のスキーマを分岐（union 型）
- local: `AWS_PROFILE`, `FIREBASE_SERVICE_ACCOUNT_PATH` が必須
- remote: `AWS_ROLE_ARN`, `FIREBASE_SERVICE_ACCOUNT_JSON` が必須
- default 値は安全なもの（`AWS_REGION` 等）のみ許可。`PORT` 等はデフォルトなし
