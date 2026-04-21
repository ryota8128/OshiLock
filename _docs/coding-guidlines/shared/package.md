# @oshilock/shared パッケージ

## エクスポート方針

- すべての公開型・定数は `src/index.ts` から re-export する
- 利用側は常に `@oshilock/shared` からインポートする
- 内部のファイルパス（`@oshilock/shared/types/card` 等）から直接インポートしない

```typescript
// ✅ 正しい
import { Card, SourceReliability } from "@oshilock/shared";

// ❌ やらない
import { Card } from "@oshilock/shared/types/card";
```

## ファイル構成

```
packages/shared/src/
  ├── index.ts          <- すべての re-export をここに集約
  └── types/
      ├── card.ts
      ├── user.ts
      └── group.ts
```

## 型を追加するとき

1. `src/types/` 配下にファイルを作成
2. `src/index.ts` に re-export を追加
