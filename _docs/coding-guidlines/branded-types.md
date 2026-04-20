# Branded Types ガイドライン

## 方針

- ID・日付・時刻などの文字列型は、素の `string` ではなく **Branded Type** を使う
- 型の取り違えをコンパイル時に検出する
- **`as` キャストは全パッケージ共通で禁止**（`from` や `schema` を使う）

## 定義場所

- `packages/shared/src/types/branded.ts` — Branded ユーティリティと ID 型
- `packages/shared/src/types/utc-iso-string.ts` — UTC ISO 8601 文字列
- `packages/shared/src/types/date-string.ts` — `YYYY-MM-DD` 形式の日付文字列
- `packages/shared/src/types/time-string.ts` — `HH:mm` 形式の時刻文字列

## namespace の構成

各 Branded Type / enum の namespace には以下を持たせる。

| メンバー | 役割 | 例 |
|---|---|---|
| `schema` | zod スキーマ（`.transform(from)` 付き） | `UserId.schema` |
| `from` | バリデーションなしの変換（信頼できるソースから） | `UserId.from("abc")` |
| `parse` | `schema.parse()` のラッパー（日付型のみ） | `UtcIsoString.parse(input)` |

```typescript
// 型定義の例
export type UserId = Branded<string, "UserId">;
export namespace UserId {
  export const schema = z.string().min(1).transform(from);
  export function from(value: string): UserId { return value as UserId; }
}
```

※ `as` は namespace 内の `from` 関数のみ許容。それ以外のファイルでは禁止。

## 値の生成（使い分け）

| ソース | 使う関数 | 理由 |
|---|---|---|
| DB からの取得 | `from` | 値の保証がある（DB に入った時点でバリデーション済み） |
| 外部入力（API リクエスト） | `schema`（zod の `.transform`） | バリデーション + 型変換を同時に行う |
| 手動バリデーション | `parse` | `schema.parse()` のラッパー |
| 現在時刻 | `now` | 生成時に正しい値が保証される |

```typescript
// ✅ DB から取得 → from
id: UserId.from(record.userId),
createdAt: UtcIsoString.from(record.createdAt),

// ✅ リクエストバリデーション → schema
const requestSchema = z.object({
  userId: UserId.schema,
  date: DateString.schema,
});

// ✅ enum の DB 値 → schema.parse（値の整合性チェック）
authProvider: AuthProvider.schema.parse(record.authProvider),
rank: UserRank.schema.parse(record.rank),

// ❌ as は使わない
id: record.userId as UserId,
createdAt: record.createdAt as UtcIsoString,
```

## enum の schema

enum 型にも `schema` を持たせる。`Object.values` ではなく `z.enum` で定義する。

```typescript
export namespace AuthProvider {
  export const schema = z.enum(["APPLE", "GOOGLE"]);
}

export namespace UserRank {
  export const schema = z.enum(["LEGEND", "STAR", "ACE", "REGULAR", "ROOKIE", "NO_RANK"]);
}
```

## ID 型

```typescript
// ✅ Branded Type を使う
type User = {
  id: UserId;
  groupId: GroupId;
};

// ❌ 素の string を使わない
type User = {
  id: string;
  groupId: string;
};
```

## 日付・時刻型

```typescript
// ✅ Branded Type を使う
type Event = {
  datetime: UtcIsoString;
  date: DateString;
  time: TimeString;
};

// ❌ 素の string を使わない
type Event = {
  datetime: string;
  date: string;
  time: string;
};
```

## タイムゾーン変換

`UtcIsoString` の namespace 関数で変換する。

```typescript
const utc = UtcIsoString.from("2026-04-18T15:00:00Z");
const date = UtcIsoString.toDateString(utc, TIMEZONES.ASIA_TOKYO); // "2026-04-19"
const time = UtcIsoString.toTimeString(utc, TIMEZONES.ASIA_TOKYO); // "00:00"
```

## `as string` キャストは不要

Branded Type は `string` を継承しているので、`string` を受け取る関数・API にそのまま渡せる。

```typescript
// ✅ そのまま渡す
const utc: UtcIsoString = ...;
new Date(utc);
const parts = date.split("-");

// ❌ as string は書かない
new Date(utc as string);
```

## 関数の追加

必要に応じて各型の `namespace` にユーティリティ関数を追加する。

```typescript
export namespace UtcIsoString {
  export function isBefore(a: UtcIsoString, b: UtcIsoString): boolean {
    return new Date(a).getTime() < new Date(b).getTime();
  }
}
```

## 正規表現

バリデーション用の正規表現は `packages/shared/src/const/regex.ts` の `REGEX` 定数にまとめる。
