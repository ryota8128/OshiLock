output "pipe_arn" {
  description = "EventBridge Pipe の ARN"
  value       = aws_pipes_pipe.this.arn
}
