# Infra ガイドライン

## Terraform コマンド

- `terraform init -upgrade` は**使わない**（provider バージョンが意図せず上がるリスク）
- 新しいモジュール追加時は `terraform init` のみ
- provider バージョンを上げたい時だけ明示的に `-upgrade` を使う

## コマンド渡しルール

- Terraform コマンドは直接実行せず、`pbcopy` でクリップボードにコピーして渡す
- `cd` はフルパスで指定する
