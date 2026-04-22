import { describe, expect, it, vi } from 'vitest';
import { CreatePostUseCase } from './create-post';
import type { IPostRepository } from '../../../domain/repository/post.repository.interface';
import type { IAiGateway } from '../../../domain/gateway/ai.gateway.interface';
import type { ISqsGateway } from '../../../domain/gateway/sqs.gateway.interface';
import type { UrlProcessor } from '../../services/post/url-processor';
import type { Post } from '@oshilock/shared';
import { UserId, OshiId, PostId, UtcIsoString, POST_STATUS } from '@oshilock/shared';

function createMockPostRepository(overrides: Partial<IPostRepository> = {}): IPostRepository {
  return {
    create: vi.fn(),
    findById: vi.fn(),
    countTodayByUser: vi.fn().mockResolvedValue(0),
    findLatestByUser: vi.fn().mockResolvedValue(null),
    updateStatus: vi.fn(),
    saveParseResult: vi.fn(),
    completeProcessing: vi.fn(),
    ...overrides,
  };
}

const mockAiGateway: IAiGateway = { parse: vi.fn(), checkDuplicate: vi.fn(), merge: vi.fn() };
const mockSqsGateway: ISqsGateway = { sendPostProcessing: vi.fn() };
const mockUrlProcessor = {
  extractUrls: vi.fn().mockReturnValue([]),
  fetchUrlText: vi.fn().mockResolvedValue(null),
} as unknown as UrlProcessor;
const mockEligibilityFilter = {
  shouldProcess: vi.fn().mockReturnValue(true),
  filterToonEntries: vi.fn(),
} as any;

const USER_ID = UserId.from('u_testUser123');
const OSHI_ID = OshiId.from('oshi_test');

const MOCK_POST: Post = {
  id: PostId.from('p_test123'),
  oshiId: OSHI_ID,
  userId: USER_ID,
  body: 'テスト投稿',
  sourceUrls: [],
  status: 'PENDING',
  parseResult: null,
  matchType: null,
  createdAt: UtcIsoString.from('2026-04-21T00:00:00.000Z'),
};

describe('CreatePostUseCase', () => {
  it('投稿を作成できる', async () => {
    const postRepository = createMockPostRepository({
      create: vi.fn().mockResolvedValue(MOCK_POST),
    });
    const useCase = new CreatePostUseCase(
      postRepository,
      mockAiGateway,
      mockUrlProcessor,
      mockSqsGateway,
      mockEligibilityFilter,
    );

    const result = await useCase.execute({
      userId: USER_ID,
      oshiId: OSHI_ID,
      body: 'テスト投稿',
      sourceUrls: [],
    });

    expect(result.body).toBe('テスト投稿');
    expect(result.status).toBe('PENDING');
    expect(postRepository.create).toHaveBeenCalled();
  });

  it('1日3件を超えると 429 エラー', async () => {
    const postRepository = createMockPostRepository({
      countTodayByUser: vi.fn().mockResolvedValue(3),
    });
    const useCase = new CreatePostUseCase(
      postRepository,
      mockAiGateway,
      mockUrlProcessor,
      mockSqsGateway,
      mockEligibilityFilter,
    );

    await expect(
      useCase.execute({
        userId: USER_ID,
        oshiId: OSHI_ID,
        body: '4件目',
        sourceUrls: [],
      }),
    ).rejects.toThrow('投稿上限に達しました');
  });

  it('5分以内の連続投稿は 429 エラー', async () => {
    const recentPost: Post = {
      ...MOCK_POST,
      createdAt: UtcIsoString.from(new Date(Date.now() - 60 * 1000).toISOString()), // 1分前
    };
    const postRepository = createMockPostRepository({
      findLatestByUser: vi.fn().mockResolvedValue(recentPost),
    });
    const useCase = new CreatePostUseCase(
      postRepository,
      mockAiGateway,
      mockUrlProcessor,
      mockSqsGateway,
      mockEligibilityFilter,
    );

    await expect(
      useCase.execute({
        userId: USER_ID,
        oshiId: OSHI_ID,
        body: 'すぐ投稿',
        sourceUrls: [],
      }),
    ).rejects.toThrow('秒後に可能です');
  });

  it('5分経過後は投稿できる', async () => {
    const oldPost: Post = {
      ...MOCK_POST,
      createdAt: UtcIsoString.from(new Date(Date.now() - 6 * 60 * 1000).toISOString()), // 6分前
    };
    const postRepository = createMockPostRepository({
      findLatestByUser: vi.fn().mockResolvedValue(oldPost),
      create: vi.fn().mockResolvedValue(MOCK_POST),
    });
    const useCase = new CreatePostUseCase(
      postRepository,
      mockAiGateway,
      mockUrlProcessor,
      mockSqsGateway,
      mockEligibilityFilter,
    );

    const result = await useCase.execute({
      userId: USER_ID,
      oshiId: OSHI_ID,
      body: 'テスト投稿',
      sourceUrls: [],
    });

    expect(result).toEqual(MOCK_POST);
  });

  describe('parseInBackground', () => {
    it('フィルタ除外された場合は SKIPPED にして SQS 送信しない', async () => {
      const postRepository = createMockPostRepository();
      const eligibilityFilter = {
        shouldProcess: vi.fn().mockReturnValue(false),
        filterToonEntries: vi.fn(),
      } as any;
      const aiGateway = {
        parse: vi.fn().mockResolvedValue({ startDate: '2020-01-01', startTime: null }),
        checkDuplicate: vi.fn(),
        merge: vi.fn(),
      } as any;
      const sqsGateway = { sendPostProcessing: vi.fn() };
      const useCase = new CreatePostUseCase(
        postRepository,
        aiGateway,
        mockUrlProcessor,
        sqsGateway,
        eligibilityFilter,
      );

      await useCase.parseInBackground(MOCK_POST);

      expect(postRepository.updateStatus).toHaveBeenCalledWith(
        MOCK_POST.oshiId,
        MOCK_POST.id,
        POST_STATUS.SKIPPED,
      );
      expect(sqsGateway.sendPostProcessing).not.toHaveBeenCalled();
    });

    it('フィルタ通過した場合は SQS 送信する', async () => {
      const postRepository = createMockPostRepository();
      const aiGateway = {
        parse: vi.fn().mockResolvedValue({ startDate: '2026-07-20', startTime: '14:00' }),
        checkDuplicate: vi.fn(),
        merge: vi.fn(),
      } as any;
      const sqsGateway = { sendPostProcessing: vi.fn() };
      const useCase = new CreatePostUseCase(
        postRepository,
        aiGateway,
        mockUrlProcessor,
        sqsGateway,
        mockEligibilityFilter,
      );

      await useCase.parseInBackground(MOCK_POST);

      expect(sqsGateway.sendPostProcessing).toHaveBeenCalledWith(MOCK_POST.oshiId, MOCK_POST.id);
    });
  });
});
