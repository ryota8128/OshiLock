---
name: implement
description: コーディング規約に従った実装（BE / Mobile / Shared 共通）
---

# 実装スキル（入口）

実装を始める前に、まず以下の共通ドキュメントを読み込む。

## 1. 必ず読むドキュメント

以下を Read ツールで読み込むこと:

- `_docs/coding-guidlines/overview.md` — PJ 全体像・モノレポ構成・開発コマンド
- `_docs/coding-guidlines/typescript.md` — TypeScript 共通ルール（as 禁止、マジックストリング禁止、any 禁止、定数参照）

## 2. 作業内容に応じたスキルを使う

作業内容に応じて、以下の専用スキルを呼び出す。各スキルが必要な規約ドキュメントを読み込む。

| スキル | 用途 |
|---|---|
| `/implement-be-api` | API エンドポイント追加・変更、use-case 追加、DI 設定 |
| `/implement-be-db` | Entity / Repository 追加・変更、DB テスト作成 |
| `/implement-be-error` | 例外クラス追加、エラーハンドリング設計 |
| `/implement-mobile-screen` | 画面追加、ナビゲーション・レイアウト設定 |
| `/implement-mobile-data` | API 呼び出し、TanStack Query hook 作成 |
| `/implement-shared` | shared パッケージへの型・定数・Branded Type 追加 |

複数の領域にまたがる場合は、該当するスキルを複数呼び出す。

## 3. 実装後の確認

- `pnpm --filter <package> lint` で型チェックが通ること
- テストが通ること
