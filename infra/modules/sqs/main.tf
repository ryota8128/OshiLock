resource "aws_sqs_queue" "this" {
  name = var.fifo ? "${var.queue_name}.fifo" : var.queue_name

  fifo_queue                  = var.fifo
  content_based_deduplication = var.fifo

  visibility_timeout_seconds = var.visibility_timeout_seconds
  message_retention_seconds  = var.message_retention_seconds

  tags = {
    Environment = var.env
    Project     = "oshilock"
  }
}
