---
name: implement-shared
description: shared パッケージへの型・定数・Branded Type 追加
---

# Shared パッケージ実装スキル

shared パッケージへの型・定数・Branded Type・enum の追加を行う。

## 読み込むドキュメント

以下を Read ツールで読み込むこと:

1. `_docs/coding-guidlines/shared/package.md` — エクスポート方針・ファイル構成
2. `_docs/coding-guidlines/shared/branded-types.md` — Branded Type・Value Object・enum

## 既存コードの確認

- `packages/shared/src/domain/` の既存ドメインモデル・enum を確認する
- `packages/shared/src/index.ts` の既存 re-export を確認する

## チェックリスト

- [ ] 新しい型・定数は `src/index.ts` から re-export する
- [ ] ID 型は Branded Type（`from` + `schema` を持つ namespace）
- [ ] enum は `z.enum` で schema を定義
- [ ] Value Object は `namespace + schema` パターン
- [ ] `as` キャストは `from` 関数内のみ許容
- [ ] 正規表現は `REGEX` 定数にまとめる
