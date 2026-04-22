# =============================================================================
# Connection（API キー認証）
# =============================================================================

resource "aws_cloudwatch_event_connection" "this" {
  name               = "${var.pipe_name}-connection"
  authorization_type = "API_KEY"

  auth_parameters {
    api_key {
      key   = "x-api-key"
      value = var.api_key_value
    }
  }
}

# =============================================================================
# API Destination（Vercel エンドポイント）
# =============================================================================

resource "aws_cloudwatch_event_api_destination" "this" {
  name                             = "${var.pipe_name}-destination"
  invocation_endpoint              = var.api_endpoint
  http_method                      = "POST"
  invocation_rate_limit_per_second = var.invocation_rate_limit_per_second
  connection_arn                   = aws_cloudwatch_event_connection.this.arn
}

# =============================================================================
# IAM Role（Pipes が SQS を読み取り、API Destination を呼び出す権限）
# =============================================================================

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["pipes.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "permissions" {
  # SQS ソース
  statement {
    sid    = "SQSSource"
    effect = "Allow"

    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
    ]

    resources = [var.sqs_queue_arn]
  }

  # API Destination ターゲット
  statement {
    sid    = "ApiDestinationTarget"
    effect = "Allow"

    actions = [
      "events:InvokeApiDestination",
    ]

    resources = [aws_cloudwatch_event_api_destination.this.arn]
  }
}

resource "aws_iam_role" "pipe" {
  name               = "${var.pipe_name}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  tags = {
    Environment = var.env
    Project     = "oshilock"
  }
}

resource "aws_iam_policy" "pipe" {
  name   = "${var.pipe_name}-policy"
  policy = data.aws_iam_policy_document.permissions.json

  tags = {
    Environment = var.env
    Project     = "oshilock"
  }
}

resource "aws_iam_role_policy_attachment" "pipe" {
  role       = aws_iam_role.pipe.name
  policy_arn = aws_iam_policy.pipe.arn
}

# =============================================================================
# EventBridge Pipe（SQS → API Destination）
# =============================================================================

resource "aws_pipes_pipe" "this" {
  name     = var.pipe_name
  role_arn = aws_iam_role.pipe.arn

  source = var.sqs_queue_arn

  source_parameters {
    sqs_queue_parameters {
      batch_size                         = 1
      maximum_batching_window_in_seconds = 0
    }
  }

  target = aws_cloudwatch_event_api_destination.this.arn

  target_parameters {
    http_parameters {
      header_parameters = {}
    }
  }

  tags = {
    Environment = var.env
    Project     = "oshilock"
  }
}
