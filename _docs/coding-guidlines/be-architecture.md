# BE アーキテクチャ ガイドライン

## ディレクトリ構成（軽量 DDD / Clean Architecture）

```
apps/be-api/src/
  index.ts                  ← エントリポイント（Hono app 定義 + サーバー起動）
  presentation/             ← リクエスト/レスポンスの変換、ルート定義
    routes/
      health.ts
      auth.ts
  application/              ← ユースケース（ドメインとインフラを組み合わせる）
    use-cases/
      sign-in.ts
  domain/                   ← ビジネスロジック（外部依存なし）
    services/
  infrastructure/           ← 外部サービスとの接続（DB、Firebase 等）
    dynamo/
      client.ts
      entity/
        user.db.ts
        user-oshi.db.ts
    firebase/               ← 後で追加
```

## レイヤー間の依存ルール

```
presentation → application → domain
                           → infrastructure
```

- `presentation/` は `application/` のみ呼ぶ
- `application/` は `domain/` と `infrastructure/` を使う
- `domain/` は外部依存なし（DB、HTTP、フレームワークを知らない）
- `infrastructure/` は `domain/` のインターフェースを実装する

## 命名規約

| 種類 | ファイル名 | 例 |
|---|---|---|
| コントローラー | `<リソース名>.controller.ts` | `auth.controller.ts`, `events.controller.ts` |
| ユースケース | `<動詞>-<名詞>.ts` | `sign-in.ts`, `create-event.ts` |
| DB エンティティ | `<モデル名>.db.ts` | `user.db.ts`, `event-info.db.ts` |
| ドメインサービス | `<名詞>-service.ts` | `rank-service.ts` |

## import 方針

- **shared パッケージ**: `@oshilock/shared` から一括 import（re-export あり）
- **BE 内部**: 直接ファイルを import（re-export の index.ts は作らない）

```typescript
// ✅ BE 内部は直接 import
import { UserEntity } from "../infrastructure/dynamo/entity/user.db.js";

// ❌ index.ts 経由にしない
import { UserEntity } from "../infrastructure/dynamo/entity/index.js";
```

## ElectroDB エンティティ

- `infrastructure/db/entities/` に配置
- ファイル名は `<モデル名>.db.ts`
- enum の type は `Object.values(定数)` で定義する
- ESM の import は `.js` 拡張子を付ける

```typescript
// ✅ 正しい
import { AUTH_PROVIDER } from "@oshilock/shared";
type: Object.values(AUTH_PROVIDER),

// ❌ リテラルで書かない
type: ["APPLE", "GOOGLE"] as const,
```

## ルート定義

- `presentation/routes/` に Hono のルートを定義
- `index.ts` で `app.route()` でマウント
- リクエストバリデーションは presentation 層で行う
- ビジネスロジックは application 層に委譲する

```typescript
// presentation/routes/auth.ts
import { Hono } from "hono";
import { signIn } from "../../application/use-cases/sign-in.js";

const auth = new Hono();

auth.post("/apple", async (c) => {
  const { identityToken } = await c.req.json();
  const result = await signIn(identityToken);
  return c.json(result);
});

export { auth };
```
