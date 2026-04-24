import type { EventInfo, EventId, OshiId } from '@oshilock/shared';
import type { IEventInfoRepository } from '../../../domain/repository/event-info.repository.interface.js';
import { NotFoundException } from '../../../domain/errors/not-found.exception.js';

export class GetEventInfoUseCase {
  constructor(private readonly eventInfoRepository: IEventInfoRepository) {}

  async execute(oshiId: OshiId, eventId: EventId): Promise<EventInfo> {
    const eventInfo = await this.eventInfoRepository.findById(oshiId, eventId);
    if (!eventInfo) {
      throw new NotFoundException('イベント情報が見つかりません');
    }
    return eventInfo;
  }
}
