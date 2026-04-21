# BE テスト

## テスト分類

| 種類 | ファイル命名 | 対象 | Docker |
|---|---|---|---|
| ユニットテスト | `*.test.ts` | use-case, domain service 等（mock 使用） | 不要 |
| DB 統合テスト | `*.db.test.ts` | repository 実装（DynamoDB Local） | 必要 |

## コマンド

```bash
pnpm --filter @oshilock/be-api test      # UT のみ
pnpm --filter @oshilock/be-api test:db   # DB テストのみ
pnpm --filter @oshilock/be-api test:all  # 全テスト
```

## Repository テストは必須

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

## テスト環境

- DynamoDB Local は testcontainers で自動起動（Docker 必須）
- `.env.test` にテスト用の環境変数を定義
- `global-setup.ts` でコンテナ起動 + テーブル作成
- `beforeEach` で `cleanupTable` を呼びテスト間の独立性を保証
