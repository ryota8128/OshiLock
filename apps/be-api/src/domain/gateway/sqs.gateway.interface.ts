import type { OshiId, PostId } from '@oshilock/shared';

export interface ISqsGateway {
  sendPostProcessing(postId: PostId, oshiId: OshiId): Promise<void>;
}
