variable "env" {
  description = "環境（dev / stg / prod）"
  type        = string
}

variable "bucket_name" {
  description = "S3 バケット名"
  type        = string
}

variable "cloudfront_price_class" {
  description = "CloudFront の価格クラス"
  type        = string
  default     = "PriceClass_200"
}

variable "cloudfront_public_key_pem" {
  description = "CloudFront signed URL 用の公開鍵（PEM 形式）"
  type        = string
}

variable "signed_url_ttl" {
  description = "signed URL のキャッシュ TTL（秒）"
  type        = number
  default     = 86400 # 24時間
}
