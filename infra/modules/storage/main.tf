# =============================================================================
# S3 Bucket (private)
# =============================================================================

resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name

  tags = {
    Environment = var.env
    Project     = "oshilock"
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = ["*"]
    max_age_seconds = 3600
  }
}

# =============================================================================
# CloudFront OAC (Origin Access Control)
# =============================================================================

resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "${var.bucket_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# S3 バケットポリシー: CloudFront OAC からのアクセス可能
resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAC"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.this.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.this.arn
          }
        }
      }
    ]
  })
}

# =============================================================================
# CloudFront Key Group (signed URL 用)
# =============================================================================

resource "aws_cloudfront_public_key" "this" {
  name        = "oshilock-${var.env}-key"
  encoded_key = var.cloudfront_public_key_pem
}

resource "aws_cloudfront_key_group" "this" {
  name = "oshilock-${var.env}-key-group"
  items = [aws_cloudfront_public_key.this.id]
}

# =============================================================================
# CloudFront Cache Policy
# 署名パラメータをキャッシュキーから除外、パスのみでキャッシュ
# =============================================================================

resource "aws_cloudfront_cache_policy" "this" {
  name        = "oshilock-${var.env}-signed-cache"
  default_ttl = var.signed_url_ttl
  max_ttl     = var.signed_url_ttl * 2
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      # クエリパラメータ（署名含む）をキャッシュキーに含めない
      query_string_behavior = "none"
    }
  }
}

# =============================================================================
# CloudFront Distribution
# =============================================================================

resource "aws_cloudfront_distribution" "this" {
  origin {
    domain_name              = aws_s3_bucket.this.bucket_regional_domain_name
    origin_id                = "s3-${var.bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
  }

  enabled         = true
  is_ipv6_enabled = true
  price_class     = var.cloudfront_price_class

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-${var.bucket_name}"
    cache_policy_id        = aws_cloudfront_cache_policy.this.id
    viewer_protocol_policy = "https-only"
    compress               = true

    # signed URL 必須
    trusted_key_groups = [aws_cloudfront_key_group.this.id]
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Environment = var.env
    Project     = "oshilock"
  }
}
