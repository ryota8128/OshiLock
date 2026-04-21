# TypeScript 共通ルール

パッケージ横断で適用する TypeScript の基本ルール。

## `as` キャストを避ける

`as` は型安全性を壊す。以下の代替手段を使う。

```typescript
// ✅ zod で parse（外部入力）
const userId = UserId.schema.parse(input);

// ✅ from 関数（信頼できるソース）
const userId = UserId.from(record.userId);

// ✅ satisfies（型チェックしつつ推論を保持）
const config = { ... } satisfies Config;

// ✅ 型ガード
function isUser(x: unknown): x is User { ... }

// ❌ as キャスト
const userId = record.userId as UserId;
const config = { ... } as Config;
```

**唯一の例外:** Branded Type の `from` 関数内の `return value as BrandedType` のみ許容。

## マジックストリング・マジックナンバーを使わない

文字列や数値のリテラルをコード中に直書きしない。shared の定数・enum・const を参照する。

```typescript
// ✅ shared の定数を参照
import { AUTH_PROVIDER, POST_CATEGORY } from '@oshilock/shared';
type: Object.values(AUTH_PROVIDER),
if (category === POST_CATEGORY.EVENT) { ... }

// ✅ ローカル定数に名前を付ける
const MAX_RETRY = 3;
const STALE_TIME = 4 * 60 * 60 * 1000; // 4時間

// ❌ 文字列リテラルを直書き
type: ["APPLE", "GOOGLE"] as const,
if (category === 'EVENT') { ... }

// ❌ 数値リテラルを直書き
if (retryCount > 3) { ... }
staleTime: 14400000,
```

## `any` を避ける

`any` は型チェックを無効化する。`unknown` + 型ガードを使う。

```typescript
// ✅ unknown + 型ガード
function handleError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

// ✅ ジェネリクスで型を伝播
function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}

// ❌ any
function handleError(err: any): string { ... }
```

## enum / const 定数は shared を正とする

- 複数パッケージで使う値は `packages/shared/` に定義し、各パッケージから import する
- 同じ値を複数箇所に定義しない（single source of truth）
- 新しい enum / const を追加する時は、まず shared に既存のものがないか確認する

```typescript
// ✅ shared から import
import { AUTH_PROVIDER, USER_RANK, POST_CATEGORY } from '@oshilock/shared';

// ❌ 各パッケージで独自に定義
const AUTH_PROVIDER = { APPLE: 'APPLE', GOOGLE: 'GOOGLE' };
```

## 正規表現は定数にまとめる

バリデーション用の正規表現は `packages/shared/src/const/regex.ts` の `REGEX` 定数にまとめる。
コード中に正規表現リテラルを直書きしない。

```typescript
// ✅ 定数を参照
import { REGEX } from '@oshilock/shared';
if (REGEX.URL.test(input)) { ... }

// ❌ 正規表現を直書き
if (/^https?:\/\//.test(input)) { ... }
```
