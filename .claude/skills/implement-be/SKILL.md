---
name: implement-be
description: BE API の実装（Hono + DynamoDB + Firebase）
---

# BE 実装スキル

## 実行手順

### 1. ドキュメントの読み込み

実装を始める前に、以下のドキュメントをすべて読み込む。

```
_docs/coding-guidlines/be-architecture.md
_docs/coding-guidlines/branded-types.md
_docs/coding-guidlines/shared-package.md
```

**`_docs/coding-guidlines/` に新しいファイルが追加されている可能性があるため、必ずディレクトリを確認してから読み込むこと。**

### 2. 既存コードの確認

- `apps/be-api/src/` のディレクトリ構成を確認する
- `packages/shared/src/domain/` のドメインモデルと enum を確認する
- `apps/be-api/src/composition/dependencies.ts` の既存の DI 構成を確認する
- `apps/be-api/src/config/env.ts` の環境変数を確認する

### 3. 実装チェックリスト

#### レイヤー分離

- [ ] presentation: controller + request schema のみ
- [ ] application: use-case クラス（コンストラクタで依存注入）
- [ ] domain: interface（repository / gateway）+ エラー定義
- [ ] infrastructure: interface の実装（ElectroDB / Firebase 等）
- [ ] composition: dependencies.ts でインスタンス生成・組み立て

#### 規約準拠

- [ ] controller で `validate()` ミドルウェアを使用（手動バリデーションしない）
- [ ] use-case はクラスベース、`execute()` メソッド
- [ ] application 層は domain の interface のみに依存（infrastructure を直接 import しない）
- [ ] controller は `composition/dependencies.ts` から use-case を取得
- [ ] `new` は composition root でのみ行う
- [ ] ElectroDB の enum type は `Object.values(定数)` で定義
- [ ] ESM の import は `.js` 拡張子を付ける
- [ ] Branded Type に `as string` キャストは不要
- [ ] shared のドメイン型を利用（repository の返り値は shared の型にマッピング）
- [ ] エラーは `OshiLockBeException` を継承（controller で try-catch しない）

### 4. 実装後の確認

- [ ] `pnpm --filter @oshilock/be-api lint` で型チェックが通ること
- [ ] `composition/dependencies.ts` に新しい use-case を追加したか
- [ ] 新しい環境変数があれば `config/env.ts` と `.env` に追加したか
