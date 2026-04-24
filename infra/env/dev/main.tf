locals {
  env = "dev"
}

terraform {
  required_version = ">= 1.12"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.41"
    }
  }

  backend "s3" {
    bucket         = "oshilock-tfstate"
    key            = "env/dev/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "oshilock-tfstate-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

module "dynamodb" {
  source = "../../modules/dynamodb"

  table_name = "oshilock-${local.env}"
  env        = local.env

  attributes = [
    { name = "pk", type = "S" },
    { name = "sk", type = "S" },
  ]
  hash_key  = "pk"
  range_key = "sk"

  global_secondary_indexes = [
    {
      name            = "GSI1"
      hash_key        = "gsi1pk"
      hash_key_type   = "S"
      range_key       = "gsi1sk"
      range_key_type  = "S"
      projection_type = "KEYS_ONLY"
    },
    {
      name            = "GSI2"
      hash_key        = "gsi2pk"
      hash_key_type   = "S"
      range_key       = "gsi2sk"
      range_key_type  = "S"
      projection_type = "KEYS_ONLY"
    },
  ]

  ttl_enabled                 = true
  pitr_enabled                = false
  deletion_protection_enabled = false
}

module "storage" {
  source = "../../modules/storage"

  env                       = local.env
  bucket_name               = "oshilock-assets-${local.env}"
  cloudfront_public_key_pem = file("../../keys/cloudfront-dev-public.pem")
}

# 投稿処理キュー（FIFO）
# MessageGroupId = oshiId で推しごとに直列、異なる推しは並列
#
# 環境別設定:
#   dev:  visibility_timeout=30,  max_receive_count=1, message_retention=4日,  dlq_retention=4日
#   stg:  visibility_timeout=30,  max_receive_count=3, message_retention=4日,  dlq_retention=4日
#   prod: visibility_timeout=300, max_receive_count=3, message_retention=14日, dlq_retention=14日
module "sqs_post_processing" {
  source = "../../modules/sqs"

  queue_name                 = "oshilock-post-processing-${local.env}"
  env                        = local.env
  fifo                       = true
  visibility_timeout_seconds = 30
  message_retention_seconds  = 345600 // 4日
  max_receive_count             = 1
  dlq_message_retention_seconds = 345600 // 4日
}

# SQS → Vercel API（EventBridge Pipe）
# API キー認証で内部 API を保護
#
# 環境別設定:
#   dev/stg: invocation_rate_limit_per_second=10
#   prod:    invocation_rate_limit_per_second=50
#
# 事前に SSM パラメータを作成すること:
#   aws ssm put-parameter \
#     --name "/oshilock/${env}/internal-api-key" \
#     --type SecureString \
#     --value "$(openssl rand -hex 32)" \
#     --profile oshilock
data "aws_ssm_parameter" "internal_api_key" {
  name = "/oshilock/${local.env}/internal-api-key"
}

module "eventbridge_post_processing" {
  source = "../../modules/eventbridge-pipe"

  pipe_name     = "oshilock-post-processing-${local.env}"
  env           = local.env
  sqs_queue_arn = module.sqs_post_processing.queue_arn
  api_endpoint                    = "https://wear-dont-notes-stockings.trycloudflare.com/internal/process-post"
  api_key_value                   = data.aws_ssm_parameter.internal_api_key.value
  invocation_rate_limit_per_second = 10
}

output "sqs_post_processing_queue_url" {
  value = module.sqs_post_processing.queue_url
}

output "cloudfront_domain_name" {
  value = module.storage.cloudfront_domain_name
}

output "cloudfront_key_pair_id" {
  value = module.storage.cloudfront_key_pair_id
}

output "s3_bucket_name" {
  value = module.storage.bucket_name
}
