---
name: implement-mobile-data
description: Mobile API 呼び出し、TanStack Query hook 作成
---

# Mobile データ取得実装スキル

API 呼び出し、TanStack Query の hook 作成を行う。

## 読み込むドキュメント

以下を Read ツールで読み込むこと:

1. `_docs/coding-guidlines/mobile/data-fetching.md` — TanStack Query パターン

## 既存コードの確認

- 既存の Query hook / Mutation hook を確認し、パターンを踏襲する
- `@oshilock/shared` のリクエスト/レスポンス型を確認する

## チェックリスト

- [ ] `staleTime` を数時間に設定（同一セッション内の再取得を防ぐ）
- [ ] queryKey は `as const` で定義
- [ ] `useInvalidateXxx` でキャッシュ無効化関数を提供
- [ ] トグル等の即時フィードバックには楽観的更新（`onMutate` + `onError` ロールバック）
- [ ] リクエスト/レスポンス型は `@oshilock/shared` から import
