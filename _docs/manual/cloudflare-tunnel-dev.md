# Cloudflare Tunnel でローカル BE を公開（dev 環境）

Vercel デプロイ前に、ローカルの BE API を EventBridge Pipes のターゲットにするための手順。

## 前提

- `cloudflared` がインストール済み
- BE API がローカルで起動中（`pnpm --filter @oshilock/be-api dev` → `localhost:3012`）
- AWS CLI でプロファイル `oshilock` が使える状態

## 手順

### 1. Cloudflare Tunnel を起動

```bash
cloudflared tunnel --url http://localhost:3012
```

ターミナルに表示されるURL（例: `https://xxxx-xxxx-xxxx.trycloudflare.com`）をコピーする。

### 2. Terraform で EventBridge Pipes のターゲットを変更

`infra/env/dev/main.tf` の `api_endpoint` をトンネル URL に書き換える。

```diff
 module "eventbridge_post_processing" {
   source = "../../modules/eventbridge-pipe"
   ...
-  api_endpoint = "https://${local.env}.api.oshilock.com/internal/process-post"
+  api_endpoint = "https://xxxx-xxxx-xxxx.trycloudflare.com/internal/process-post"
   ...
 }
```

### 3. Terraform apply

```bash
cd /Users/ryotasato/FlowTune/dev/OshiLock/infra/env/dev && terraform plan -target=module.eventbridge_post_processing
```

差分を確認して問題なければ:

```bash
cd /Users/ryotasato/FlowTune/dev/OshiLock/infra/env/dev && terraform apply -target=module.eventbridge_post_processing
```

### 4. 動作確認

アプリから投稿 → BE のログに以下が出れば成功:

```
<-- POST /posts
--> POST /posts 201 ...
<-- POST /internal/process-post    ← EventBridge 経由でトンネルから届く
--> POST /internal/process-post 200 ...
```

### 5. 終了時

1. `Ctrl+C` で cloudflared を停止
2. `main.tf` の `api_endpoint` を元に戻す

```bash
cd /Users/ryotasato/FlowTune/dev/OshiLock/infra/env/dev && terraform apply -target=module.eventbridge_post_processing
```

## 注意

- トンネル URL は起動のたびに変わる（Quick Tunnel）
- トンネル停止中に SQS にメッセージが溜まると、EventBridge が呼び出し失敗 → dev 環境は `max_receive_count=1` なのでメッセージは破棄される
- `main.tf` の変更はコミットしないこと
