---
name: implement-be-api
description: BE API エンドポイント追加・変更、use-case 追加、DI 設定
---

# BE API 実装スキル

API エンドポイントの追加・変更を行う。

## 読み込むドキュメント

以下を Read ツールで読み込むこと:

1. `_docs/coding-guidlines/be/architecture.md` — ディレクトリ構成・レイヤー依存・命名・import
2. `_docs/coding-guidlines/be/api-contracts.md` — リクエスト/レスポンス型
3. `_docs/coding-guidlines/be/di.md` — DI パターン
4. `_docs/coding-guidlines/be/env.md` — 環境変数（新しい環境変数が必要な場合）

## 既存コードの確認

- `apps/be-api/src/` のディレクトリ構成を確認する
- `apps/be-api/src/composition/dependencies.ts` の既存の DI 構成を確認する
- `packages/shared/src/domain/` のドメインモデルと enum を確認する
- 同種の既存エンドポイントを確認し、パターンを踏襲する

## チェックリスト

- [ ] controller で `validate()` ミドルウェアを使用（手動バリデーションしない）
- [ ] use-case はクラスベース、`execute()` メソッド
- [ ] application 層は domain の interface のみに依存
- [ ] controller は `composition/dependencies.ts` から use-case を取得
- [ ] `new` は composition root でのみ
- [ ] ESM の import は `.js` 拡張子を付ける
- [ ] リクエスト/レスポンス型は shared に定義
- [ ] `composition/dependencies.ts` に新しい use-case を追加したか
- [ ] 新しい環境変数があれば `config/env.ts` と `.env` に追加したか
