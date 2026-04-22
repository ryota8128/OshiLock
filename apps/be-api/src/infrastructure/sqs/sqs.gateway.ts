import { SendMessageCommand, type SQSClient } from '@aws-sdk/client-sqs';
import type { OshiId, PostId } from '@oshilock/shared';
import type { ISqsGateway } from '../../domain/gateway/sqs.gateway.interface.js';
import { env } from '../../config/env.js';

export class SqsGateway implements ISqsGateway {
  constructor(private readonly client: SQSClient) {}

  async sendPostProcessing(oshiId: OshiId, postId: PostId): Promise<void> {
    await this.client.send(
      new SendMessageCommand({
        QueueUrl: env.SQS_QUEUE_URL,
        MessageBody: JSON.stringify({ oshiId, postId }),
        MessageGroupId: oshiId,
      }),
    );
  }
}
