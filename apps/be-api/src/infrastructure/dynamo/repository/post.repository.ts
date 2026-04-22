import {
  type Post,
  type UserId,
  type OshiId,
  type PostId,
  type PostStatus,
  POST_STATUS,
  UtcIsoString,
  DateString,
  TIMEZONES,
} from '@oshilock/shared';
import type {
  CreatePostParams,
  IPostRepository,
} from '../../../domain/repository/post.repository.interface.js';
import { PostDb } from '../entity/post.db.js';

export class DynamoPostRepository implements IPostRepository {
  async create(params: CreatePostParams): Promise<Post> {
    const now = UtcIsoString.now();

    const result = await PostDb.entity
      .create({
        postId: params.postId,
        oshiId: params.oshiId,
        userId: params.userId,
        body: params.body,
        sourceUrls: params.sourceUrls,
        status: POST_STATUS.PENDING,
        createdAt: now,
      })
      .go();

    return PostDb.toDomain(result.data);
  }

  async findById(oshiId: OshiId, postId: PostId): Promise<Post | null> {
    const result = await PostDb.entity.query.primary({ oshiId, postId }).go();
    const record = result.data[0];
    return record ? PostDb.toDomain(record) : null;
  }

  async countTodayByUser(userId: UserId, oshiId: OshiId): Promise<number> {
    const todayStart = DateString.now(TIMEZONES.ASIA_TOKYO) + 'T00:00:00.000Z';

    // GSI SK (POST#${createdAt}) の範囲クエリで今日以降をフィルタ
    // KEYS_ONLY GSI なので hydrate: true で主テーブルから再取得し、oshiId で JS フィルタ
    const result = await PostDb.entity.query
      .byUser({ userId })
      .gte({ createdAt: todayStart })
      .go({ hydrate: true, pages: 'all' });

    return result.data.filter((item) => item.oshiId === oshiId).length;
  }

  async findLatestByUser(userId: UserId): Promise<Post | null> {
    const result = await PostDb.entity.query
      .byUser({ userId })
      .go({ hydrate: true, order: 'desc', limit: 1 });

    const record = result.data[0];
    return record ? PostDb.toDomain(record) : null;
  }

  async updateStatus(oshiId: OshiId, postId: PostId, status: PostStatus): Promise<void> {
    await PostDb.entity.patch({ oshiId, postId }).set({ status }).go();
  }

  async saveParseResult(oshiId: OshiId, postId: PostId, parseResultJson: string): Promise<void> {
    await PostDb.entity
      .patch({ oshiId, postId })
      .set({ parseResult: parseResultJson, status: POST_STATUS.PARSED })
      .where(({ status }, { eq }) => eq(status, POST_STATUS.PARSING as string))
      .go();
  }
}
