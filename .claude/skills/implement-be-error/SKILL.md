---
name: implement-be-error
description: 例外クラス追加、エラーハンドリング設計
---

# BE エラーハンドリング実装スキル

例外クラスの追加・エラーレスポンス設計を行う。

## 読み込むドキュメント

以下を Read ツールで読み込むこと:

1. `_docs/coding-guidlines/be/error-handling.md` — 例外クラス・エラーレスポンス形式

## 既存コードの確認

- `apps/be-api/src/domain/errors/` の既存例外クラスを確認する
- `apps/be-api/src/presentation/middleware/error-handler.ts` を確認する

## チェックリスト

- [ ] `OshiLockBeException` を継承して `domain/errors/` に配置
- [ ] `statusCode` + `message` + `toJSON()` を実装
- [ ] `throw new Error()` は使わない（必ずカスタム例外）
- [ ] コントローラーで try-catch は不要（エラーハンドラーに任せる）
