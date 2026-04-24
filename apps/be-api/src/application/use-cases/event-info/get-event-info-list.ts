import type { OshiId, PaginationParams, PaginatedResult, EventInfo } from '@oshilock/shared';
import type { IEventInfoRepository } from '../../../domain/repository/event-info.repository.interface.js';

export class GetEventInfoListUseCase {
  constructor(private readonly eventInfoRepository: IEventInfoRepository) {}

  async execute(oshiId: OshiId, pagination: PaginationParams): Promise<PaginatedResult<EventInfo>> {
    return this.eventInfoRepository.findByOshi(oshiId, pagination);
  }
}
