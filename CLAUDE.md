# OshiLock プロジェクト

## 概要
推し活ファン向け情報コミュニティアプリ。運営による情報投入 + ファンのUGC投稿 + AIの自動整理で、推しの情報を一元管理する。

## 技術スタック
- アプリ: Expo（React Native）— iOS先行
- API: Hono on Vercel Functions
- DB: DynamoDB（シングルテーブル設計）
- AI: プロバイダー・モデル切り替え可能な抽象層
- 通知: Expo Push Notifications
- 認証: Apple Sign In + Google Sign In

## 開発コマンド
- API: `pnpm --filter @oshilock/be-api dev`
- Mobile: `pnpm --filter @oshilock/mobile start`
- Mobile (Tailscale): `REACT_NATIVE_PACKAGER_HOSTNAME=$(tailscale ip -4) pnpm --filter @oshilock/mobile start`

## ドキュメント構成
- `_docs/要件定義/概要.md` — 要件定義・確定事項・未決定事項
- `_docs/要件定義/機能詳細.md` — 機能の詳細仕様
- `_docs/tasks/<タスク名>/` — タスクごとのドキュメント（計画・設計・メモ）
- `_docs/coding-guidlines/` — コーディング規約
- `_docs/マーケティング/` — X投稿等のマーケティング資料
- `_docs/作業ログ/log.md` — 作業ログ（重要な意思決定・進捗を記録）

## タスクドキュメント運用ルール
- `_docs/tasks/<タスク名>/` ディレクトリにタスクごとのドキュメントをまとめる
- `plan.md` — 実装計画・手順書
- `design.md` — 設計メモ（必要に応じて）
- `notes.md` — 作業中のメモ・意思決定記録（必要に応じて）
- タスク完了後も残す（後から振り返れるように）

## 作業ログ運用ルール
- `_docs/作業ログ/log.md` に重要な更新・意思決定を記録する
- 1ファイルで管理し、肥大化を防ぐ
- 古くなった情報はサマライズして圧縮する
- 定期的に大事な更新があった場合に追記する
