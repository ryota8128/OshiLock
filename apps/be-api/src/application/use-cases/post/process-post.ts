import type { PostId } from '@oshilock/shared';
import {
  EventId,
  UtcIsoString,
  TIMEZONES,
  POST_STATUS,
  SOURCE_RELIABILITY,
  MATCH_TYPE,
} from '@oshilock/shared';
import type { IPostRepository } from '../../../domain/repository/post.repository.interface.js';
import type { IEventInfoRepository } from '../../../domain/repository/event-info.repository.interface.js';
import type { IAiGateway } from '../../../domain/gateway/ai.gateway.interface.js';
import { ParseResultJson } from '../../../domain/value-objects/parse-result-json.js';
import type { UrlDuplicateChecker } from '../../services/post/url-duplicate-checker.js';
import type { ToonService } from '../../services/post/toon-service.js';
import { NotFoundException } from '../../../domain/errors/not-found.exception.js';
import { OshiLockBeException } from '../../../domain/errors/oshilock-be.exception.js';

export class ProcessPostUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly eventInfoRepository: IEventInfoRepository,
    private readonly aiGateway: IAiGateway,
    private readonly urlDuplicateChecker: UrlDuplicateChecker,
    private readonly toonService: ToonService,
  ) {}

  async execute(postId: PostId): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('投稿が見つかりません');
    }
    if (post.status !== POST_STATUS.PARSED) {
      throw new OshiLockBeException(409, `投稿のステータスが不正です: ${post.status}`);
    }
    if (!post.parseResult) {
      throw new OshiLockBeException(500, 'パース結果が保存されていません');
    }

    const oshiId = post.oshiId;
    await this.postRepository.updateStatus(postId, POST_STATUS.PROCESSING);

    try {
      const parseResult = ParseResultJson.parse(post.parseResult);

      // TODO: 推しごとの公式ドメインリストと照合して OFFICIAL 判定する（GitHub Issue #4）
      const sourceReliability =
        post.sourceUrls.length > 0 ? SOURCE_RELIABILITY.SOURCED : SOURCE_RELIABILITY.UNVERIFIED;

      // 1. URL 重複チェック（コードベース、高速）
      const isUrlDuplicate = await this.urlDuplicateChecker.isDuplicate(oshiId, post.sourceUrls);
      if (isUrlDuplicate) {
        await this.postRepository.completeProcessing(postId, MATCH_TYPE.DUPLICATE);
        return;
      }

      // 2. S3 TOON 読み込み + フィルタ
      const { rawToon, filteredToon } = await this.toonService.getFilteredToon(oshiId);

      // 3. AI 被り判定
      const duplicateResult = await this.aiGateway.checkDuplicate({
        parseResult,
        filteredToon,
      });

      // 4a. DUPLICATE: スキップ
      if (duplicateResult.matchType === MATCH_TYPE.DUPLICATE) {
        await this.postRepository.completeProcessing(postId, MATCH_TYPE.DUPLICATE);
        return;
      }

      // 4b. NEW: EventInfo 作成 + TOON 更新
      if (duplicateResult.matchType === MATCH_TYPE.NEW) {
        const newEvent = await this.eventInfoRepository.create({
          eventId: EventId.generate(),
          oshiId,
          posterId: post.userId,
          parseResult,
          sourceUrls: post.sourceUrls,
          sourceReliability,
        });
        await this.toonService.updateToon(oshiId, rawToon, newEvent);
        await this.postRepository.completeProcessing(postId, MATCH_TYPE.NEW);
        return;
      }

      // 4c. UPDATE: AI マージ → 既存 EventInfo 更新 + TOON 更新
      if (!duplicateResult.matchedEventId) {
        throw new OshiLockBeException(500, 'マージ対象のeventIdがLLMから取得できませんでした');
      }

      const existingEvent = await this.eventInfoRepository.findById(
        oshiId,
        duplicateResult.matchedEventId,
      );
      if (!existingEvent) {
        throw new NotFoundException(
          `マージ対象の EventInfo が見つかりません: ${duplicateResult.matchedEventId}`,
        );
      }

      const mergeRawResult = await this.aiGateway.merge({
        existingEventInfo: existingEvent,
        parseResult,
      });

      const mergedStartDate = mergeRawResult.startDate ?? existingEvent.schedule.startDate;
      const mergeResult = { ...mergeRawResult, startDate: mergedStartDate };

      // マージ後の開始日時 なければ、下のsortDateを使う
      const sortDate = mergedStartDate
        ? UtcIsoString.fromDateAndTime(mergedStartDate, mergeResult.startTime, TIMEZONES.ASIA_TOKYO)
        : existingEvent.sortDate;

      const mergedSourceUrls = [
        ...new Set([...post.sourceUrls, ...existingEvent.sourceUrls]),
      ].slice(0, 3);

      const updatedEvent = await this.eventInfoRepository.updateFromMerge({
        oshiId,
        eventId: duplicateResult.matchedEventId,
        mergeResult,
        sortDate,
        sourceUrls: mergedSourceUrls,
      });
      await this.toonService.updateToon(oshiId, rawToon, updatedEvent);
      await this.postRepository.completeProcessing(postId, MATCH_TYPE.UPDATE);
    } catch (e) {
      console.error('Post processing failed:', e);
      await this.postRepository.updateStatus(postId, POST_STATUS.FAILED);
      throw e;
    }
  }
}
