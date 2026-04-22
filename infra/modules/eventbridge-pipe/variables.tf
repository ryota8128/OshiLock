variable "pipe_name" {
  description = "Pipe 名"
  type        = string
}

variable "env" {
  description = "環境（dev / stg / prod）"
  type        = string
}

variable "sqs_queue_arn" {
  description = "ソースとなる SQS キューの ARN"
  type        = string
}

variable "api_endpoint" {
  description = "ターゲットの API エンドポイント URL（例: https://xxx.vercel.app/internal/process-post）"
  type        = string
}

variable "api_key_value" {
  description = "API キー認証の値"
  type        = string
  sensitive   = true
}

variable "invocation_rate_limit_per_second" {
  description = "API Destination の秒間最大リクエスト数"
  type        = number
}
