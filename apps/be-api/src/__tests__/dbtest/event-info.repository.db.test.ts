import { describe, it, expect, beforeEach } from 'vitest';
import { EventId, OshiId, UserId, SOURCE_RELIABILITY, EVENT_CATEGORY } from '@oshilock/shared';
import type { AiParseResult } from '../../domain/gateway/ai-parse-result.js';
import { ACTIVE_PARSE_RESULT_VERSION } from '../../domain/gateway/ai-parse-result.js';
import { DynamoEventInfoRepository } from '../../infrastructure/dynamo/repository/event-info.repository.js';
import { createTestDocumentClient } from './helpers/dynamodb-client.js';
import { cleanupTable } from './helpers/cleanup.js';

const docClient = createTestDocumentClient();
const repository = new DynamoEventInfoRepository();

const OSHI_ID = OshiId.from('oshi_test');

function createMockParseResult(overrides: Partial<AiParseResult> = {}): AiParseResult {
  return {
    version: ACTIVE_PARSE_RESULT_VERSION,
    title: 'テストイベント',
    category: EVENT_CATEGORY.EVENT,
    startDate: '2026-07-20',
    startTime: '18:00',
    endDate: null,
    endTime: null,
    summary: 'テストイベント 7/20開催',
    detail: 'テストイベントの詳細情報',
    ...overrides,
  } as AiParseResult;
}

describe('DynamoEventInfoRepository', () => {
  beforeEach(async () => {
    await cleanupTable(docClient);
  });

  describe('create', () => {
    it('EventInfo を作成して返す', async () => {
      const eventId = EventId.generate();
      const userId = UserId.generate();

      const eventInfo = await repository.create({
        eventId,
        oshiId: OSHI_ID,
        posterId: userId,
        parseResult: createMockParseResult(),
        sourceUrls: ['https://example.com/event'],
        sourceReliability: SOURCE_RELIABILITY.OFFICIAL,
      });

      expect(eventInfo.id).toBe(eventId);
      expect(eventInfo.oshiId).toBe(OSHI_ID);
      expect(eventInfo.title).toBe('テストイベント');
      expect(eventInfo.category).toBe(EVENT_CATEGORY.EVENT);
      expect(eventInfo.schedule.startDate).toBe('2026-07-20');
      expect(eventInfo.schedule.startTime).toBe('18:00');
      expect(eventInfo.schedule.endDate).toBeNull();
      expect(eventInfo.summary).toBe('テストイベント 7/20開催');
      expect(eventInfo.detail).toBe('テストイベントの詳細情報');
      expect(eventInfo.sourceReliability).toBe(SOURCE_RELIABILITY.OFFICIAL);
      expect(eventInfo.sourceUrls).toEqual(['https://example.com/event']);
      expect(eventInfo.fastestPosterIds[0]).toBe(userId);
      expect(eventInfo.commentCount).toBe(0);
      expect(eventInfo.savedCount).toBe(0);
      expect(eventInfo.tasukaruCount).toBe(0);
    });
  });

  describe('findById', () => {
    it('EventInfo を取得できる', async () => {
      const eventId = EventId.generate();

      await repository.create({
        eventId,
        oshiId: OSHI_ID,
        posterId: UserId.generate(),
        parseResult: createMockParseResult(),
        sourceUrls: [],
        sourceReliability: SOURCE_RELIABILITY.UNVERIFIED,
      });

      const found = await repository.findById(OSHI_ID, eventId);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(eventId);
    });

    it('存在しない場合は null を返す', async () => {
      const found = await repository.findById(OSHI_ID, EventId.generate());
      expect(found).toBeNull();
    });
  });

  describe('findByOshi', () => {
    it('推しの EventInfo 一覧を取得できる', async () => {
      const userId = UserId.generate();

      await repository.create({
        eventId: EventId.generate(),
        oshiId: OSHI_ID,
        posterId: userId,
        parseResult: createMockParseResult({ title: '1件目' }),
        sourceUrls: [],
        sourceReliability: SOURCE_RELIABILITY.UNVERIFIED,
      });
      await repository.create({
        eventId: EventId.generate(),
        oshiId: OSHI_ID,
        posterId: userId,
        parseResult: createMockParseResult({ title: '2件目' }),
        sourceUrls: [],
        sourceReliability: SOURCE_RELIABILITY.UNVERIFIED,
      });

      const result = await repository.findByOshi(OSHI_ID, { limit: 10 });
      expect(result.items).toHaveLength(2);
    });

    it('他推しの EventInfo は含まれない', async () => {
      await repository.create({
        eventId: EventId.generate(),
        oshiId: OSHI_ID,
        posterId: UserId.generate(),
        parseResult: createMockParseResult(),
        sourceUrls: [],
        sourceReliability: SOURCE_RELIABILITY.UNVERIFIED,
      });
      await repository.create({
        eventId: EventId.generate(),
        oshiId: OshiId.from('oshi_other'),
        posterId: UserId.generate(),
        parseResult: createMockParseResult(),
        sourceUrls: [],
        sourceReliability: SOURCE_RELIABILITY.UNVERIFIED,
      });

      const result = await repository.findByOshi(OSHI_ID, { limit: 10 });
      expect(result.items).toHaveLength(1);
    });

    it('ページネーションで取得できる', async () => {
      const userId = UserId.generate();

      for (let i = 0; i < 3; i++) {
        await repository.create({
          eventId: EventId.generate(),
          oshiId: OSHI_ID,
          posterId: userId,
          parseResult: createMockParseResult({ title: `イベント${i}` }),
          sourceUrls: [],
          sourceReliability: SOURCE_RELIABILITY.UNVERIFIED,
        });
      }

      const page1 = await repository.findByOshi(OSHI_ID, { limit: 2 });
      expect(page1.items).toHaveLength(2);
      expect(page1.cursor).not.toBeNull();

      const page2 = await repository.findByOshi(OSHI_ID, { limit: 2, cursor: page1.cursor });
      expect(page2.items).toHaveLength(1);
    });
  });

  describe('findByOshiAndCategory', () => {
    it('カテゴリでフィルタできる', async () => {
      const userId = UserId.generate();

      await repository.create({
        eventId: EventId.generate(),
        oshiId: OSHI_ID,
        posterId: userId,
        parseResult: createMockParseResult({ category: EVENT_CATEGORY.EVENT }),
        sourceUrls: [],
        sourceReliability: SOURCE_RELIABILITY.UNVERIFIED,
      });
      await repository.create({
        eventId: EventId.generate(),
        oshiId: OSHI_ID,
        posterId: userId,
        parseResult: createMockParseResult({ category: EVENT_CATEGORY.GOODS }),
        sourceUrls: [],
        sourceReliability: SOURCE_RELIABILITY.UNVERIFIED,
      });

      const result = await repository.findByOshiAndCategory(OSHI_ID, EVENT_CATEGORY.EVENT, {
        limit: 10,
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].category).toBe(EVENT_CATEGORY.EVENT);
    });
  });
});
