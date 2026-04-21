---
name: implement
description: コーディング規約に従った実装（BE / Mobile / Shared 共通）
---

# 実装スキル

コーディング規約に従ってタスクを実装する。規約は必要なタイミングで該当ファイルのみ読み込む。

## 規約ファイルと読み込みタイミング

規約は `_docs/coding-guidlines/` に配置されている。**全ファイルを事前に読む必要はない。** 作業内容に応じて該当ファイルを読み込む。

### 共通（常に確認）

| ファイル | 読み込みタイミング |
|---|---|
| `typescript.md` | **常に確認。** `as` キャスト禁止、マジックストリング禁止、`any` 禁止、定数参照ルール |
| `monorepo.md` | 依存追加・pnpm 操作時 |

### BE（`be/`）

| ファイル | 読み込みタイミング |
|---|---|
| `be/architecture.md` | 新規ファイル作成時、ディレクトリ配置・命名を決める時 |
| `be/api-contracts.md` | API エンドポイント追加・変更、リクエスト/レスポンス型定義時 |
| `be/di.md` | use-case 追加、`dependencies.ts` 変更時 |
| `be/error-handling.md` | 例外クラス追加・エラーレスポンス設計時 |
| `be/database.md` | Entity / Repository 追加・変更、ElectroDB クエリ作成時 |
| `be/testing.md` | テスト作成時 |
| `be/env.md` | 環境変数追加・変更時 |

### Mobile（`mobile/`）

| ファイル | 読み込みタイミング |
|---|---|
| `mobile/navigation.md` | 画面追加、ヘッダー・ナビゲーション設定時 |
| `mobile/data-fetching.md` | API 呼び出し、TanStack Query hook 作成時 |
| `mobile/layout.md` | 画面レイアウト、Safe Area 設定時 |
| `mobile/auth.md` | Firebase Auth 関連の実装時 |

### Shared（`shared/`）

| ファイル | 読み込みタイミング |
|---|---|
| `shared/package.md` | shared パッケージに型・定数を追加する時 |
| `shared/branded-types.md` | Branded Type / Value Object / enum の追加・使用時 |

## 実行手順

### 1. 作業内容の把握

- タスク定義（`_docs/tasks/` 配下）や会話コンテキストから作業内容を理解する
- 変更対象のファイルと周辺コードを読む

### 2. 該当する規約の読み込み

上の表に従い、**これから行う作業に関係する規約ファイルだけ**を読み込む。

例：
- Repository を追加する → `be/architecture.md` + `be/database.md` + `be/testing.md`
- API エンドポイントを追加する → `be/architecture.md` + `be/api-contracts.md` + `be/di.md`
- Mobile で新画面を追加する → `mobile/navigation.md` + `mobile/layout.md` + `mobile/data-fetching.md`

**注意: `_docs/coding-guidlines/` に新しいファイルが追加されている可能性があるため、作業開始時にディレクトリ内容を確認すること。**

### 3. 既存コードの確認

- 変更対象と同種の既存実装を確認し、パターンを踏襲する
- `packages/shared/src/domain/` のドメインモデルと enum を確認する

### 4. 実装

- 規約に沿ってコードを実装する
- テストを書く（`vitest`）

### 5. 実装後の確認

- `pnpm --filter <package> lint` で型チェックが通ること
- テストが通ること
- 読み込んだ規約のルールを再確認する
