# BE アーキテクチャ

## ディレクトリ構成（軽量 DDD / Clean Architecture）

```
apps/be-api/src/
  index.ts                  <- エントリポイント（Hono app + エラーハンドラー + ルートマウント）
  config/
    env.ts                  <- 環境変数の zod バリデーション（IS_LOCAL で local/remote 分岐）
  composition/
    dependencies.ts         <- DI composition root（全インスタンスの生成・組み立て）
  presentation/
    middleware/
      validate.ts           <- リクエストバリデーション（query + body を zod でパース）
      error-handler.ts      <- 例外キャッチ -> JSON レスポンス
    routes/
      health.controller.ts
      auth/
        auth.controller.ts
        auth-request.schema.ts
  application/
    use-cases/
      auth/
        sign-in.ts          <- クラスベース、コンストラクタで依存注入
  domain/
    errors/
      oshilock-be.exception.ts   <- ベース例外
      validation.exception.ts    <- バリデーション例外
    gateway/
      auth.gateway.interface.ts  <- 外部認証サービスの interface
    repository/
      user.repository.interface.ts <- DB アクセスの interface
    services/
  infrastructure/
    dynamo/
      client.ts
      entity/
        user.db.ts
      repository/
        user.repository.ts       <- IUserRepository の実装
    firebase/
      client.ts
      auth.gateway.ts            <- IAuthGateway の実装
```

## レイヤー間の依存ルール

```
presentation -> composition -> application -> domain
                                           <- infrastructure (implements domain interfaces)
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
