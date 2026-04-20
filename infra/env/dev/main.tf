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
