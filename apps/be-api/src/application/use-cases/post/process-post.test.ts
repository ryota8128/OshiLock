import { describe, expect, it, vi } from 'vitest';
import { ProcessPostUseCase } from './process-post.js';
import type { IPostRepository } from '../../../domain/repository/post.repository.interface.js';
import type { IEventInfoRepository } from '../../../domain/repository/event-info.repository.interface.js';
import type { UrlDuplicateChecker } from '../../services/post/url-duplicate-checker.js';
import type { Post } from '@oshilock/shared';
import {
  UserId,
  OshiId,
  PostId,
  UtcIsoString,
  POST_STATUS,
  SOURCE_RELIABILITY,
  EVENT_CATEGORY,
} from '@oshilock/shared';
import { ACTIVE_PARSE_RESULT_VERSION } from '../../../domain/value-objects/parse-result-json.js';

const OSHI_ID = OshiId.from('o_test');
const POST_ID = PostId.from('p_test');
const USER_ID = UserId.from('u_test');

const MOCK_PARSE_RESULT = JSON.stringify({
  isRelevant: true,
  version: ACTIVE_PARSE_RESULT_VERSION,
  title: '夏フェス2026',
  category: EVENT_CATEGORY.EVENT,
  startDate: '2026-07-20',
  startTime: '14:00',
  endDate: null,
  endTime: null,
  summary: '夏フェス 7/20開催',
  detail: '東京ガーデンシアターで開催',
});

const MOCK_POST: Post = {
  id: POST_ID,
  oshiId: OSHI_ID,
  userId: USER_ID,
  body: '夏フェスやるよ',
  sourceUrls: ['https://example.com/event'],
  status: POST_STATUS.PARSED,
  parseResult: MOCK_PARSE_RESULT,
  matchType: null,
  createdAt: UtcIsoString.from('2026-04-22T00:00:00.000Z'),
};

function createMockPostRepository(overrides: Partial<IPostRepository> = {}): IPostRepository {
  return {
    create: vi.fn(),
    findById: vi.fn().mockResolvedValue(MOCK_POST),
    countTodayByUser: vi.fn(),
    findLatestByUser: vi.fn(),
    updateStatus: vi.fn(),
    saveParseResult: vi.fn(),
    completeProcessing: vi.fn(),
    ...overrides,
  };
}

function createMockEventInfoRepository(
  overrides: Partial<IEventInfoRepository> = {},
): IEventInfoRepository {
  return {
    create: vi.fn().mockResolvedValue({ id: 'e_new', oshiId: OSHI_ID }),
    findById: vi.fn(),
    findByOshi: vi.fn(),
    findByOshiAndCategory: vi.fn(),
    updateFromMerge: vi.fn(),
    ...overrides,
  };
}

const mockAiGateway = {
  parse: vi.fn(),
  checkDuplicate: vi.fn().mockResolvedValue({ matchType: 'NEW', matchedEventId: null }),
  merge: vi.fn(),
} as any;

const mockSummaryGateway = {
  getToonSummary: vi.fn().mockResolvedValue(null),
  putToonSummary: vi.fn(),
} as any;

function createMockUrlDuplicateChecker(overrides: Partial<UrlDuplicateChecker> = {}) {
  return {
    isDuplicate: vi.fn().mockResolvedValue(false),
    ...overrides,
  } as unknown as UrlDuplicateChecker;
}

const mockEligibilityFilter = {
  shouldProcess: vi.fn().mockReturnValue(true),
  filterToonEntries: vi.fn().mockReturnValue([]),
} as any;

const mockToonService = {
  getFilteredToon: vi.fn().mockResolvedValue({ rawToon: '', filteredToon: '' }),
  updateToon: vi.fn(),
} as any;

describe('ProcessPostUseCase', () => {
  it('新規投稿から EventInfo を作成する', async () => {
    const postRepo = createMockPostRepository();
    const eventRepo = createMockEventInfoRepository();
    const checker = createMockUrlDuplicateChecker();
    const useCase = new ProcessPostUseCase(
      postRepo,
      eventRepo,
      mockAiGateway,
      checker,
      mockToonService,
    );

    await useCase.execute(POST_ID);

    expect(postRepo.updateStatus).toHaveBeenCalledWith(POST_ID, POST_STATUS.PROCESSING);
    expect(eventRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        oshiId: OSHI_ID,
        posterId: USER_ID,
        sourceReliability: SOURCE_RELIABILITY.SOURCED,
      }),
    );
    expect(postRepo.completeProcessing).toHaveBeenCalled();
  });

  it('sourceUrls が空なら UNVERIFIED', async () => {
    const postWithoutUrls: Post = { ...MOCK_POST, sourceUrls: [] };
    const postRepo = createMockPostRepository({
      findById: vi.fn().mockResolvedValue(postWithoutUrls),
    });
    const eventRepo = createMockEventInfoRepository();
    const checker = createMockUrlDuplicateChecker();
    const useCase = new ProcessPostUseCase(
      postRepo,
      eventRepo,
      mockAiGateway,
      checker,
      mockToonService,
    );

    await useCase.execute(POST_ID);

    expect(eventRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceReliability: SOURCE_RELIABILITY.UNVERIFIED,
      }),
    );
  });

  it('重複する場合は EventInfo を作成しない', async () => {
    const postRepo = createMockPostRepository();
    const eventRepo = createMockEventInfoRepository();
    const checker = createMockUrlDuplicateChecker({
      isDuplicate: vi.fn().mockResolvedValue(true),
    });
    const useCase = new ProcessPostUseCase(
      postRepo,
      eventRepo,
      mockAiGateway,
      checker,
      mockToonService,
    );

    await useCase.execute(POST_ID);

    expect(eventRepo.create).not.toHaveBeenCalled();
    expect(postRepo.completeProcessing).toHaveBeenCalled();
  });

  it('AI が DUPLICATE 判定したらスキップ', async () => {
    const postRepo = createMockPostRepository();
    const eventRepo = createMockEventInfoRepository();
    const checker = createMockUrlDuplicateChecker();
    const aiGateway = {
      ...mockAiGateway,
      checkDuplicate: vi.fn().mockResolvedValue({ matchType: 'DUPLICATE', matchedEventId: null }),
    };
    const useCase = new ProcessPostUseCase(
      postRepo,
      eventRepo,
      aiGateway,
      checker,
      mockToonService,
    );

    await useCase.execute(POST_ID);

    expect(eventRepo.create).not.toHaveBeenCalled();
    expect(eventRepo.updateFromMerge).not.toHaveBeenCalled();
    expect(postRepo.completeProcessing).toHaveBeenCalled();
  });

  it('AI が UPDATE 判定したら既存 EventInfo をマージ更新する', async () => {
    const existingEvent = {
      id: 'e_existing',
      oshiId: OSHI_ID,
      schedule: { startDate: '2026-07-20', startTime: '14:00', endDate: null, endTime: null },
      sourceUrls: ['https://old.com'],
      sortDate: '2026-07-20T05:00:00.000Z',
    } as any;

    const postRepo = createMockPostRepository();
    const eventRepo = createMockEventInfoRepository({
      findById: vi.fn().mockResolvedValue(existingEvent),
      updateFromMerge: vi.fn().mockResolvedValue(existingEvent),
    });
    const checker = createMockUrlDuplicateChecker();
    const aiGateway = {
      ...mockAiGateway,
      checkDuplicate: vi
        .fn()
        .mockResolvedValue({ matchType: 'UPDATE', matchedEventId: 'e_existing' }),
      merge: vi.fn().mockResolvedValue({
        title: '夏フェス2026（更新）',
        category: 'EVENT',
        startDate: '2026-07-20',
        startTime: '14:00',
        endDate: null,
        endTime: null,
        summary: '更新サマリ',
        detail: '更新詳細',
      }),
    };
    const useCase = new ProcessPostUseCase(
      postRepo,
      eventRepo,
      aiGateway,
      checker,
      mockToonService,
    );

    await useCase.execute(POST_ID);

    expect(eventRepo.updateFromMerge).toHaveBeenCalled();
    expect(eventRepo.create).not.toHaveBeenCalled();
    expect(mockToonService.updateToon).toHaveBeenCalled();
    expect(postRepo.completeProcessing).toHaveBeenCalled();
  });

  it('UPDATE でマージ対象が見つからない場合はエラー', async () => {
    const postRepo = createMockPostRepository();
    const eventRepo = createMockEventInfoRepository({
      findById: vi.fn().mockResolvedValue(null),
    });
    const checker = createMockUrlDuplicateChecker();
    const aiGateway = {
      ...mockAiGateway,
      checkDuplicate: vi
        .fn()
        .mockResolvedValue({ matchType: 'UPDATE', matchedEventId: 'e_missing' }),
    };
    const useCase = new ProcessPostUseCase(
      postRepo,
      eventRepo,
      aiGateway,
      checker,
      mockToonService,
    );

    await expect(useCase.execute(POST_ID)).rejects.toThrow(
      'マージ対象の EventInfo が見つかりません',
    );
    expect(postRepo.updateStatus).toHaveBeenCalledWith(POST_ID, POST_STATUS.FAILED);
  });

  it('投稿が見つからない場合はエラー', async () => {
    const postRepo = createMockPostRepository({
      findById: vi.fn().mockResolvedValue(null),
    });
    const eventRepo = createMockEventInfoRepository();
    const checker = createMockUrlDuplicateChecker();
    const useCase = new ProcessPostUseCase(
      postRepo,
      eventRepo,
      mockAiGateway,
      checker,
      mockToonService,
    );

    await expect(useCase.execute(POST_ID)).rejects.toThrow('投稿が見つかりません');
    expect(postRepo.updateStatus).not.toHaveBeenCalled();
  });
});
