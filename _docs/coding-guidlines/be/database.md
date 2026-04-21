# BE データベース（ElectroDB）

## エンティティ

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
// ✅ enum の type は Object.values で定義（ElectroDB・Gemini スキーマ等すべてで共通）
import { AUTH_PROVIDER } from "@oshilock/shared";
type: Object.values(AUTH_PROVIDER),

// ❌ リテラルで書かない（shared の定数から参照する）
type: ["APPLE", "GOOGLE"] as const,
enum: ['EVENT', 'GOODS', 'MEDIA', 'SNS', 'NEWS'],
```

## クエリ

### GSI クエリの hydrate

GSI は KEYS_ONLY で定義しているため、GSI 経由のクエリには常に `hydrate: true` を指定する。
primary インデックスのクエリには不要。

```typescript
// ✅ GSI クエリ -> hydrate: true
const result = await UserEntity.query.byAuth({ authProvider, authSub }).go({ hydrate: true });

// ✅ primary クエリ -> hydrate 不要
const result = await UserEntity.query.primary({ userId }).go();

// ✅ 例外: GSI から key のみ取得したい場合は明示的に hydrate: false
const result = await UserEntity.query.byAuth({ authProvider, authSub }).go({ hydrate: false });
```

### DB -> ドメインモデル変換

entity ファイルの `toXxx` 関数で変換する（上記エンティティのセクション参照）。
repository では `toXxx` を import して使うだけ。

### DynamoDB の map 属性はフラット化する

ElectroDB の map 型は部分更新が複雑になるため、**DB 属性はフラット化**し、domain モデル側は map 構造を維持する。`toDomain` で変換する。

```typescript
// ✅ DB: フラット属性
attributes: {
  notificationReminder: { type: 'boolean', required: true, default: true },
  notificationDailySummary: { type: 'boolean', required: true, default: true },
}

// ✅ toDomain で map 構造に変換
export function toDomain(record: Item): UserSettings {
  return {
    notification: {
      reminder: record.notificationReminder,
      dailySummary: record.notificationDailySummary,
    },
  };
}

// ✅ 部分更新は pickDefined + .set() でシンプルに
.set(pickDefined({
  notificationReminder: params.notification.reminder,
  notificationDailySummary: params.notification.dailySummary,
}))
```

```typescript
// ❌ map 型で定義しない（部分更新が複雑になる）
notification: {
  type: 'map',
  properties: {
    reminder: { type: 'boolean', required: true },
  },
}
```

### pickDefined ユーティリティ

`infrastructure/dynamo/utils.ts` の `pickDefined` で undefined を除外してから `.set()` に渡す。
`-?` で optional 修飾子を除去し、型レベルでも undefined を消す。

```typescript
// { reminder?: boolean | undefined } -> { reminder: boolean }
export function pickDefined<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]-?: Exclude<T[K], undefined> } { ... }
```
