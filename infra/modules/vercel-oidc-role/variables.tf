variable "role_name" {
  description = "IAM ロール名"
  type        = string
}

variable "oidc_provider_arn" {
  description = "Vercel OIDC プロバイダー ARN"
  type        = string
}

variable "oidc_provider_url" {
  description = "OIDC プロバイダー URL（https なし、例: oidc.vercel.com/team-slug）"
  type        = string
}

variable "oidc_audience" {
  description = "OIDC audience（例: https://vercel.com/team-slug）"
  type        = string
}

variable "vercel_sub_claim" {
  description = "Vercel の sub クレーム値（例: owner:team-slug:project:oshilock:environment:production）"
  type        = string
}

variable "dynamodb_table_arn" {
  description = "アクセスを許可する DynamoDB テーブル ARN"
  type        = string
}

variable "s3_bucket_arn" {
  description = "アクセスを許可する S3 バケット ARN"
  type        = string
}

variable "env" {
  description = "環境（dev / stg / prod）"
  type        = string
}
