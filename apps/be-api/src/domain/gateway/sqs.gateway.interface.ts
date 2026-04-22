import type { OshiId, PostId } from '@oshilock/shared';

export interface ISqsGateway {
  sendPostProcessing(oshiId: OshiId, postId: PostId): Promise<void>;
}
