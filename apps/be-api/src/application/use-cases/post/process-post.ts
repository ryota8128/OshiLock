import type { OshiId, PostId } from '@oshilock/shared';
import { EventId, POST_STATUS, SOURCE_RELIABILITY } from '@oshilock/shared';
import type { IPostRepository } from '../../../domain/repository/post.repository.interface.js';
import type { IEventInfoRepository } from '../../../domain/repository/event-info.repository.interface.js';
import { ParseResultJson } from '../../../domain/value-objects/parse-result-json.js';
import type { DuplicateChecker } from '../../services/post/duplicate-checker.js';
import { NotFoundException } from '../../../domain/errors/not-found.exception.js';
import { OshiLockBeException } from '../../../domain/errors/oshilock-be.exception.js';

export class ProcessPostUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly eventInfoRepository: IEventInfoRepository,
    private readonly duplicateChecker: DuplicateChecker,
  ) {}

  async execute(oshiId: OshiId, postId: PostId): Promise<void> {
    await this.postRepository.updateStatus(oshiId, postId, POST_STATUS.PROCESSING);

    try {
      const post = await this.postRepository.findById(oshiId, postId);
      if (!post) {
        throw new NotFoundException('投稿が見つかりません');
      }
      if (post.status !== POST_STATUS.PARSED) {
        throw new OshiLockBeException(409, `投稿のステータスが不正です: ${post.status}`);
      }
      if (!post.parseResult) {
        throw new OshiLockBeException(500, 'パース結果が保存されていません');
      }

      const parseResult = ParseResultJson.parse(post.parseResult);

      // TODO: 推しごとの公式ドメインリストと照合して OFFICIAL 判定する（GitHub Issue #4）
      const sourceReliability =
        post.sourceUrls.length > 0 ? SOURCE_RELIABILITY.SOURCED : SOURCE_RELIABILITY.UNVERIFIED;

      const isDuplicate = await this.duplicateChecker.isDuplicate(oshiId, post.sourceUrls);

      if (!isDuplicate) {
        await this.eventInfoRepository.create({
          eventId: EventId.generate(),
          oshiId,
          posterId: post.userId,
          parseResult,
          sourceUrls: post.sourceUrls,
          sourceReliability,
        });
      }

      // TODO: S3 TOON サマリを使った AI 被り判定 + マージ（フェーズ C で実装）
      // URL 重複チェックを通過した場合に、AI で既存 EventInfo との意味的重複を判定する
      // new → そのまま / duplicate → スキップ / related → 既存 EventInfo にマージ

      await this.postRepository.updateStatus(oshiId, postId, POST_STATUS.SUCCESS);
    } catch (e) {
      console.error('Post processing failed:', e);
      await this.postRepository.updateStatus(oshiId, postId, POST_STATUS.FAILED);
      throw e;
    }
  }
}
