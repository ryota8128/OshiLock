# プロジェクト概要

## OshiLock とは

推し活ファン向け情報コミュニティアプリ。運営による情報投入 + ファンの UGC 投稿 + AI の自動整理で、推しの情報を一元管理する。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| アプリ | Expo（React Native）— iOS 先行 |
| API | Hono on Vercel Functions |
| DB | DynamoDB（シングルテーブル設計、ElectroDB） |
| AI | プロバイダー・モデル切り替え可能な抽象層 |
| 通知 | Expo Push Notifications |
| 認証 | Apple Sign In + Google Sign In（Firebase Auth） |

## モノレポ構成

```
OshiLock/
  apps/
    be-api/          @oshilock/be-api    — API サーバー（Hono）
    mobile/          @oshilock/mobile    — iOS アプリ（Expo）
    lp/              @oshilock/lp        — ランディングページ
  packages/
    shared/          @oshilock/shared    — BE・Mobile 共通の型・定数・enum
  _docs/                                 — ドキュメント
  pnpm-workspace.yaml                    — ワークスペース定義 + catalog
```

## パッケージマネージャー

- **pnpm** を使用する
- `pnpm install` は常にルートから実行する
- 共通ライブラリのバージョンは `pnpm-workspace.yaml` の `catalog:` で一元管理する
- 各 package.json ではバージョン指定に `catalog:` を使う
- ワークスペース内パッケージへの参照は `workspace:*` を使う

## 開発コマンド

```bash
# 依存インストール（ルートから）
pnpm install

# API サーバー起動
pnpm --filter @oshilock/be-api dev

# Mobile 起動
pnpm --filter @oshilock/mobile start

# Mobile 起動（Tailscale 経由）
REACT_NATIVE_PACKAGER_HOSTNAME=$(tailscale ip -4) pnpm --filter @oshilock/mobile start

# リント
pnpm --filter @oshilock/be-api lint
pnpm --filter @oshilock/mobile lint

# テスト
pnpm --filter @oshilock/be-api test       # UT のみ
pnpm --filter @oshilock/be-api test:db    # DB テストのみ
pnpm --filter @oshilock/be-api test:all   # 全テスト
```

## shared パッケージの役割

- BE と Mobile で共有する型・定数・enum・zod スキーマを定義する
- すべて `@oshilock/shared` から import する（内部パスを直接参照しない）
- 詳細は `shared/package.md` と `shared/branded-types.md` を参照
