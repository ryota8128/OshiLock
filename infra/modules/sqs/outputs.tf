output "queue_url" {
  description = "SQS キューの URL"
  value       = aws_sqs_queue.this.url
}

output "queue_arn" {
  description = "SQS キューの ARN"
  value       = aws_sqs_queue.this.arn
}

output "queue_name" {
  description = "SQS キューの名前"
  value       = aws_sqs_queue.this.name
}
