import type { Post, UserId, OshiId, PostId, PostStatus, MatchType } from '@oshilock/shared';

export type CreatePostParams = {
  postId: PostId;
  oshiId: OshiId;
  userId: UserId;
  body: string;
  sourceUrls: string[];
};

export interface IPostRepository {
  create(params: CreatePostParams): Promise<Post>;
  findById(postId: PostId): Promise<Post | null>;
  countTodayByUser(userId: UserId, oshiId: OshiId): Promise<number>;
  findLatestByUser(userId: UserId): Promise<Post | null>;
  updateStatus(postId: PostId, status: PostStatus): Promise<void>;
  saveParseResult(postId: PostId, parseResultJson: string): Promise<void>;
  completeProcessing(postId: PostId, matchType: MatchType): Promise<void>;
}
