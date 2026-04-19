variable "table_name" {
  description = "テーブル名"
  type        = string
}

variable "env" {
  description = "環境（dev / stg / prod）"
  type        = string
}

variable "billing_mode" {
  description = "課金モード（PAY_PER_REQUEST または PROVISIONED）"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "attributes" {
  description = "属性定義。GSI で使用する属性も含めること"
  type = list(object({
    name = string
    type = string # S, N, B
  }))
}

variable "hash_key" {
  description = "パーティションキー（PK）"
  type        = string
}

variable "range_key" {
  description = "ソートキー（SK）"
  type        = string
  default     = null
}

variable "global_secondary_indexes" {
  description = "GSI 定義。hash_key / range_key で参照する属性は attributes に含めること"
  type = list(object({
    name               = string
    hash_key           = string
    hash_key_type      = string
    range_key          = optional(string)
    range_key_type     = optional(string)
    projection_type    = string # ALL, KEYS_ONLY, INCLUDE
    non_key_attributes = optional(list(string))
  }))
  default = []
}

variable "ttl_enabled" {
  description = "TTL を有効にするか"
  type        = bool
}

variable "ttl_attribute_name" {
  description = "TTL 属性名"
  type        = string
  default     = "ttl"
}

variable "pitr_enabled" {
  description = "Point-in-Time Recovery を有効にするか"
  type        = bool
}

variable "deletion_protection_enabled" {
  description = "削除保護を有効にするか"
  type        = bool
}
