resource "aws_sqs_queue" "dlq" {
  name = var.fifo ? "${var.queue_name}-dlq.fifo" : "${var.queue_name}-dlq"

  fifo_queue                  = var.fifo
  content_based_deduplication = var.fifo

  message_retention_seconds = var.dlq_message_retention_seconds

  tags = {
    Environment = var.env
    Project     = "oshilock"
  }
}

resource "aws_sqs_queue" "this" {
  name = var.fifo ? "${var.queue_name}.fifo" : var.queue_name

  fifo_queue                  = var.fifo
  content_based_deduplication = var.fifo

  visibility_timeout_seconds = var.visibility_timeout_seconds
  message_retention_seconds  = var.message_retention_seconds

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = var.max_receive_count
  })

  tags = {
    Environment = var.env
    Project     = "oshilock"
  }
}
