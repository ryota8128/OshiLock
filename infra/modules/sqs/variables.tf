variable "queue_name" {
  description = "キュー名"
  type        = string
}

variable "env" {
  description = "環境（dev / stg / prod）"
  type        = string
}

variable "fifo" {
  description = "FIFO キューにするか"
  type        = bool
}

variable "visibility_timeout_seconds" {
  description = "可視性タイムアウト（秒）。ワーカーの処理時間より長くする"
  type        = number
}

variable "message_retention_seconds" {
  description = "メッセージ保持期間（秒）"
  type        = number
}

variable "max_receive_count" {
  description = "最大受信回数。超えたら DLQ へ移動"
  type        = number
}

variable "dlq_message_retention_seconds" {
  description = "DLQ のメッセージ保持期間（秒）"
  type        = number
}
