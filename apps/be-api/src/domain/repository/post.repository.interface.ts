import type { Post, UserId, OshiId, PostId, PostStatus } from '@oshilock/shared';

export type CreatePostParams = {
  postId: PostId;
  oshiId: OshiId;
  userId: UserId;
  body: string;
  sourceUrls: string[];
};

export interface IPostRepository {
  create(params: CreatePostParams): Promise<Post>;
  countTodayByUser(userId: UserId, oshiId: OshiId): Promise<number>;
  findLatestByUser(userId: UserId): Promise<Post | null>;
  updateStatus(oshiId: OshiId, postId: PostId, status: PostStatus): Promise<void>;
}
