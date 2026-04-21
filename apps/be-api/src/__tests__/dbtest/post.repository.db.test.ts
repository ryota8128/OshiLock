import { describe, it, expect, beforeEach } from 'vitest';
import { PostId, OshiId, UserId } from '@oshilock/shared';
import { DynamoPostRepository } from '../../infrastructure/dynamo/repository/post.repository.js';
import { PostDb } from '../../infrastructure/dynamo/entity/post.db.js';
import { createTestDocumentClient } from './helpers/dynamodb-client.js';
import { cleanupTable } from './helpers/cleanup.js';

const docClient = createTestDocumentClient();
const repository = new DynamoPostRepository();

const OSHI_ID = OshiId.from('oshi_test');

describe('DynamoPostRepository', () => {
  beforeEach(async () => {
    await cleanupTable(docClient);
  });

  describe('create', () => {
    it('投稿を作成して返す', async () => {
      const postId = PostId.generate();
      const userId = UserId.generate();

      const post = await repository.create({
        postId,
        oshiId: OSHI_ID,
        userId,
        body: 'テスト投稿です',
        sourceUrls: ['https://example.com/article'],
      });

      expect(post.id).toBe(postId);
      expect(post.body).toBe('テスト投稿です');
      expect(post.sourceUrls).toEqual(['https://example.com/article']);
      expect(post.status).toBe('PENDING');
      expect(post.oshiId).toBe(OSHI_ID);
      expect(post.userId).toBe(userId);
    });

    it('sourceUrls が空でも作成できる', async () => {
      const post = await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId: UserId.generate(),
        body: 'URLなし投稿',
        sourceUrls: [],
      });

      expect(post.sourceUrls).toEqual([]);
    });
  });

  describe('countTodayByUser', () => {
    it('本日の投稿数をカウントできる', async () => {
      const userId = UserId.generate();

      await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId,
        body: '1件目',
        sourceUrls: [],
      });
      await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId,
        body: '2件目',
        sourceUrls: [],
      });

      const count = await repository.countTodayByUser(userId, OSHI_ID);
      expect(count).toBe(2);
    });

    it('他ユーザーの投稿はカウントしない', async () => {
      const userA = UserId.generate();
      const userB = UserId.generate();

      await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId: userA,
        body: 'Aの投稿',
        sourceUrls: [],
      });
      await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId: userB,
        body: 'Bの投稿',
        sourceUrls: [],
      });

      const count = await repository.countTodayByUser(userA, OSHI_ID);
      expect(count).toBe(1);
    });

    it('他推しの投稿はカウントしない', async () => {
      const userId = UserId.generate();
      const otherOshi = OshiId.from('oshi_other');

      await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId,
        body: '推しAへの投稿',
        sourceUrls: [],
      });
      await repository.create({
        postId: PostId.generate(),
        oshiId: otherOshi,
        userId,
        body: '推しBへの投稿',
        sourceUrls: [],
      });

      const count = await repository.countTodayByUser(userId, OSHI_ID);
      expect(count).toBe(1);
    });

    it('投稿がなければ 0 を返す', async () => {
      const count = await repository.countTodayByUser(UserId.generate(), OSHI_ID);
      expect(count).toBe(0);
    });
  });

  describe('findLatestByUser', () => {
    it('最新の投稿を取得できる', async () => {
      const userId = UserId.generate();

      await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId,
        body: '1件目',
        sourceUrls: [],
      });
      const second = await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId,
        body: '2件目',
        sourceUrls: [],
      });

      const latest = await repository.findLatestByUser(userId);
      expect(latest).not.toBeNull();
      expect(latest!.id).toBe(second.id);
      expect(latest!.body).toBe('2件目');
    });

    it('投稿がなければ null を返す', async () => {
      const latest = await repository.findLatestByUser(UserId.generate());
      expect(latest).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('ステータスを PROCESSED に更新できる', async () => {
      const post = await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId: UserId.generate(),
        body: 'ステータス変更テスト',
        sourceUrls: [],
      });

      await repository.updateStatus(OSHI_ID, post.id, 'PROCESSED');

      const result = await PostDb.entity.query.primary({ oshiId: OSHI_ID, postId: post.id }).go();
      expect(result.data[0]?.status).toBe('PROCESSED');
    });

    it('ステータスを FAILED に更新できる', async () => {
      const post = await repository.create({
        postId: PostId.generate(),
        oshiId: OSHI_ID,
        userId: UserId.generate(),
        body: '失敗テスト',
        sourceUrls: [],
      });

      await repository.updateStatus(OSHI_ID, post.id, 'FAILED');

      const result = await PostDb.entity.query.primary({ oshiId: OSHI_ID, postId: post.id }).go();
      expect(result.data[0]?.status).toBe('FAILED');
    });
  });
});
