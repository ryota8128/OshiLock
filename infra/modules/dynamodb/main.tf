resource "aws_dynamodb_table" "this" {
  name         = var.table_name
  billing_mode = var.billing_mode
  hash_key     = var.hash_key
  range_key    = var.range_key

  deletion_protection_enabled = var.deletion_protection_enabled

  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  dynamic "ttl" {
    for_each = var.ttl_enabled ? [1] : []
    content {
      enabled        = true
      attribute_name = var.ttl_attribute_name
    }
  }

  dynamic "point_in_time_recovery" {
    for_each = var.pitr_enabled ? [1] : []
    content {
      enabled = true
    }
  }

  tags = {
    Environment = var.env
    Project     = "oshilock"
  }
}

# GSI は別リソースで管理（追加・削除時にテーブル再作成を防ぐ）
resource "aws_dynamodb_global_secondary_index" "this" {
  for_each = { for gsi in var.global_secondary_indexes : gsi.name => gsi }

  table_name = aws_dynamodb_table.this.name
  index_name = each.key

  key_schema {
    attribute_name = each.value.hash_key
    attribute_type = each.value.hash_key_type
    key_type       = "HASH"
  }

  dynamic "key_schema" {
    for_each = each.value.range_key != null ? [1] : []
    content {
      attribute_name = each.value.range_key
      attribute_type = each.value.range_key_type
      key_type       = "RANGE"
    }
  }

  projection {
    projection_type    = each.value.projection_type
    non_key_attributes = each.value.projection_type == "INCLUDE" ? each.value.non_key_attributes : null
  }
}
