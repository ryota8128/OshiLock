# モノレポ ガイドライン

## パッケージマネージャー

- pnpm を使用する
- `pnpm install` は常にルートから実行する

## 依存バージョン管理（catalog）

- 共通ライブラリのバージョンは `pnpm-workspace.yaml` の `catalog:` で一元管理する
- 各 package.json ではバージョン指定に `catalog:` を使う
- ワークスペース内パッケージへの参照は `workspace:*` を使う

```yaml
# pnpm-workspace.yaml
catalog:
  hono: ^4.12.14
  typescript: ^5.8.3
```

```json
// 各 package.json
{
  "dependencies": {
    "hono": "catalog:",
    "@oshilock/shared": "workspace:*"
  }
}
```

## バージョンを更新するとき

1. `pnpm-workspace.yaml` の catalog を更新
2. `pnpm install` でロックファイルを更新
