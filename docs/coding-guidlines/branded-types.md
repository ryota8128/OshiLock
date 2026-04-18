# Branded Types ガイドライン

## 方針

- ID・日付・時刻などの文字列型は、素の `string` ではなく **Branded Type** を使う
- 型の取り違えをコンパイル時に検出する

## 定義場所

- `packages/shared/src/types/branded.ts` — Branded ユーティリティと ID 型
- `packages/shared/src/types/utc-iso-string.ts` — UTC ISO 8601 文字列
- `packages/shared/src/types/date-string.ts` — `YYYY-MM-DD` 形式の日付文字列
- `packages/shared/src/types/time-string.ts` — `HH:mm` 形式の時刻文字列

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

## 値の生成

各型の namespace に定義された関数を使う。

```typescript
// from: バリデーションなし（信頼できるソースから）
const id = "abc" as UserId;
const utc = UtcIsoString.from("2026-04-18T09:00:00Z");

// parse: zod バリデーション付き（外部入力から）
const utc = UtcIsoString.parse(input); // 不正な値は ZodError
const date = DateString.parse(input);
const time = TimeString.parse(input);  // HH:mm のみ、秒付き不可

// now: 現在時刻の取得
const utcNow = UtcIsoString.now();                      // 引数なし
const dateNow = DateString.now(TIMEZONES.ASIA_TOKYO);    // timezone 必須
const timeNow = TimeString.now(TIMEZONES.ASIA_TOKYO);    // timezone 必須
```

## タイムゾーン変換

`UtcIsoString` の namespace 関数で変換する。

```typescript
const utc = UtcIsoString.from("2026-04-18T15:00:00Z");
const date = UtcIsoString.toDateString(utc, TIMEZONES.ASIA_TOKYO); // "2026-04-19"
const time = UtcIsoString.toTimeString(utc, TIMEZONES.ASIA_TOKYO); // "00:00"
```

## 関数の追加

必要に応じて各型の `namespace` にユーティリティ関数を追加する。

```typescript
// 例: UtcIsoString に比較関数を追加
export namespace UtcIsoString {
  export function isBefore(a: UtcIsoString, b: UtcIsoString): boolean {
    return new Date(a).getTime() < new Date(b).getTime();
  }
}
```

## 正規表現

バリデーション用の正規表現は `packages/shared/src/const/regex.ts` の `REGEX` 定数にまとめる。
