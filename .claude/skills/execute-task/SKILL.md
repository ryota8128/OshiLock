---
name: execute-task
description: タスク定義の実行
---

# タスク実行スキル

コーディング規約に従ってタスクを実装するスキル。

## 実行手順

### 1. コーディング規約の読み込み

実装を始める前に、以下のドキュメントをすべて読み込む。

```
_docs/coding-guidlines/monorepo.md
_docs/coding-guidlines/shared-package.md
_docs/coding-guidlines/branded-types.md
```

**新しいガイドラインファイルが追加されている可能性があるため、必ず `_docs/coding-guidlines/` ディレクトリを確認してから読み込むこと。**

### 2. 関連コードの確認

- 変更対象のファイルと周辺コードを読む
- 既存の型定義（`packages/shared/src/types/`）を確認する
- 既存のドメインモデル（`packages/shared/src/domain/`）を確認する

### 3. 規約チェックリスト

実装時に以下を遵守する。

#### Branded Types

- ID 型（UserId, GroupId, CardId 等）は素の `string` ではなく Branded Type を使う
- 日付・時刻型（UtcIsoString, DateString, TimeString）も Branded Type を使う
- 外部入力には `parse`（zod バリデーション付き）を使う
- 信頼できるソースには `from` を使う
- 必要に応じて各型の `namespace` にユーティリティ関数を追加する
- 正規表現は `packages/shared/src/const/regex.ts` の `REGEX` 定数にまとめる

#### モノレポ

- `pnpm install` はルートから実行する
- 依存バージョンは `pnpm-workspace.yaml` の `catalog:` で一元管理する
- ワークスペース内パッケージへの参照は `workspace:*` を使う

#### shared パッケージ

- 公開型・定数は `src/index.ts` から re-export する
- 利用側は `@oshilock/shared` からインポートする（内部パスを直接参照しない）
- 新しい型は `src/types/` 配下にファイルを作成し、`src/index.ts` に re-export を追加する

### 4. 実装

- 規約に沿ってコードを実装する
- テストを書く（`vitest`）
- `pnpm --filter <package> test` でテストが通ることを確認する

### 5. 実装後の確認

- 規約チェックリストを再確認する
- 型チェック（`pnpm --filter <package> lint`）が通ることを確認する
