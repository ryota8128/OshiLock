import type { OshiId, UserId } from '@oshilock/shared';
import { RateLimitException } from '../errors/rate-limit.exception.js';
import type { IPostRepository } from '../repository/post.repository.interface.js';

const DAILY_LIMIT = 3;
const COOL_DOWN_MS = 5 * 60 * 1000;

export class PostCreationPolicy {
  constructor(private readonly postRepository: IPostRepository) {}

  async ensureCanCreate(userId: UserId, oshiId: OshiId): Promise<void> {
    await this.checkDailyLimit(userId, oshiId);
    await this.checkCoolDown(userId);
  }

  private async checkDailyLimit(userId: UserId, oshiId: OshiId): Promise<void> {
    const todayCount = await this.postRepository.countTodayByUser(userId, oshiId);
    if (todayCount >= DAILY_LIMIT) {
      throw new RateLimitException('投稿上限に達しました（1日3件まで）');
    }
  }

  private async checkCoolDown(userId: UserId): Promise<void> {
    const latest = await this.postRepository.findLatestByUser(userId);
    if (latest) {
      const elapsed = Date.now() - new Date(latest.createdAt).getTime();
      if (elapsed < COOL_DOWN_MS) {
        const remainSec = Math.ceil((COOL_DOWN_MS - elapsed) / 1000);
        throw new RateLimitException(`投稿は${remainSec}秒後に可能です`);
      }
    }
  }
}
