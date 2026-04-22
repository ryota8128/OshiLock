import type { OshiId } from '@oshilock/shared';
import type { IEventInfoRepository } from '../../../domain/repository/event-info.repository.interface.js';

export class UrlDuplicateChecker {
  constructor(private readonly eventInfoRepository: IEventInfoRepository) {}

  async isDuplicate(oshiId: OshiId, normalizedUrls: string[]): Promise<boolean> {
    if (normalizedUrls.length === 0) return false;

    const { items: existingEvents } = await this.eventInfoRepository.findByOshi(oshiId, {
      limit: 100,
    });

    return existingEvents.some((event) =>
      normalizedUrls.some((url) => event.sourceUrls.includes(url)),
    );
  }
}
