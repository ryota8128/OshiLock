---
name: update-guidelines
description: 実装規約に追加すべき内容を検出し、コーディングガイドラインを更新する
---

# コーディングガイドライン更新スキル

会話の中で決まった実装方針・規約をコーディングガイドラインに反映する。
バックグラウンドエージェントで実行し、メインエージェントの作業を止めない。

## 規約のディレクトリ構成

```
_docs/coding-guidlines/
  overview.md              -- 共通: PJ全体像・モノレポ構成・開発コマンド
  typescript.md            -- 共通: TypeScript ルール（as禁止、マジックストリング禁止等）
  be/                      -- BE API
    architecture.md        -- ディレクトリ構成・レイヤー・命名・import
    api-contracts.md       -- リクエスト/レスポンス型
    di.md                  -- DI
    error-handling.md      -- エラーハンドリング
    database.md            -- ElectroDB エンティティ+クエリ
    testing.md             -- テスト
    env.md                 -- 環境変数
  mobile/                  -- Mobile
    navigation.md          -- ナビゲーション
    data-fetching.md       -- TanStack Query
    layout.md              -- Safe Area
    auth.md                -- Firebase Auth
  shared/                  -- Shared パッケージ
    package.md             -- エクスポート方針
    branded-types.md       -- Branded Types
```

## 実行手順

### 1. 既存ガイドラインの確認

`_docs/coding-guidlines/` 配下の全ファイルを読み込み、現在の規約内容を把握する。

### 2. 追加すべき内容の検出

現在の会話コンテキストから、以下に該当するものを抽出する：

- 新しく決まった実装パターン・命名規約
- 既存規約と矛盾する変更（修正が必要）
- 既存規約に含まれていない新しいルール
- コードレビューで指摘された改善点

### 3. ユーザーへのサマリ提示

**書き込む前に**、以下の形式でユーザーに提示し承認を得る：

```
## ガイドライン更新提案

### 追加先: `_docs/coding-guidlines/<dir>/<ファイル名>.md`

**追加内容:**
- <追加する規約の要約 1>
- <追加する規約の要約 2>

**変更内容:**
- <変更する既存規約の要約>

追加してよいですか？
```

### 4. 承認後に書き込み

- 既存ファイルの適切なセクションに追加する
- 新しいカテゴリの場合は適切なディレクトリに新規ファイルを作成する
- ファイル全体の整合性を確認する

### 5. implement スキル群への反映

**規約ファイルを追加・削除・リネームした場合は、対応する implement スキルも更新すること。**

スキル一覧（`.claude/skills/` 配下）:

| スキル | 参照する規約 |
|---|---|
| `implement/` | `overview.md`, `typescript.md`（入口、常に読む） |
| `implement-be-api/` | `be/architecture.md`, `be/api-contracts.md`, `be/di.md`, `be/env.md` |
| `implement-be-db/` | `be/database.md`, `be/architecture.md`, `be/testing.md` |
| `implement-be-error/` | `be/error-handling.md` |
| `implement-mobile-screen/` | `mobile/navigation.md`, `mobile/layout.md`, `mobile/auth.md` |
| `implement-mobile-data/` | `mobile/data-fetching.md` |
| `implement-shared/` | `shared/package.md`, `shared/branded-types.md` |

更新内容:
- 新規規約ファイル追加 → 該当スキルの「読み込むドキュメント」に追加
- 規約ファイル削除 → 該当スキルから参照を削除
- 新しい分野の規約 → 必要に応じて新しい implement スキルを作成

## 注意事項

- ユーザーの承認なしに書き込まない
- 既存の規約を勝手に削除・変更しない（変更提案として提示する）
- 些細すぎる内容（1回限りの判断等）は規約に入れない
