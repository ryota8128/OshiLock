---
name: implement-be-db
description: Entity / Repository 追加・変更、DB テスト作成
---

# BE データベース実装スキル

ElectroDB Entity / Repository の追加・変更を行う。

## 読み込むドキュメント

以下を Read ツールで読み込むこと:

1. `_docs/coding-guidlines/be/database.md` — ElectroDB エンティティ・クエリ・キーテンプレート設計
2. `_docs/coding-guidlines/be/architecture.md` — ディレクトリ構成・命名（entity / repository の配置）
3. `_docs/coding-guidlines/be/testing.md` — DB 統合テスト

## 既存コードの確認

- `apps/be-api/src/infrastructure/dynamo/entity/` の既存エンティティを確認する
- `apps/be-api/src/infrastructure/dynamo/repository/` の既存リポジトリを確認する
- `apps/be-api/src/domain/repository/` の既存 interface を確認する
- `packages/shared/src/domain/` のドメインモデルを確認する

## チェックリスト

- [ ] Entity は `<モデル名>.db.ts` に namespace パターンで定義
- [ ] `toXxx` マッピング関数を entity ファイルに定義
- [ ] enum の type は `Object.values(定数)` で定義
- [ ] repository は domain の interface を実装
- [ ] GSI クエリには `hydrate: true` を指定
- [ ] map 属性はフラット化（部分更新のため）
- [ ] Repository テスト（`*.db.test.ts`）を作成
