import type {
  EventInfo,
  EventId,
  OshiId,
  EventCategory,
  PaginationParams,
  PaginatedResult,
} from '@oshilock/shared';
import { UtcIsoString } from '@oshilock/shared';
import type {
  CreateEventInfoParams,
  IEventInfoRepository,
} from '../../../domain/repository/event-info.repository.interface.js';
import { EventInfoDb } from '../entity/event-info.db.js';

export class DynamoEventInfoRepository implements IEventInfoRepository {
  async create(params: CreateEventInfoParams): Promise<EventInfo> {
    const now = UtcIsoString.now();

    const result = await EventInfoDb.entity
      .create({
        eventId: params.eventId,
        oshiId: params.oshiId,
        title: params.parseResult.title,
        scheduleStartDate: params.parseResult.startDate ?? undefined,
        scheduleStartTime: params.parseResult.startTime ?? undefined,
        scheduleEndDate: params.parseResult.endDate ?? undefined,
        scheduleEndTime: params.parseResult.endTime ?? undefined,
        summary: params.parseResult.summary,
        detail: params.parseResult.detail,
        category: params.parseResult.category,
        sourceReliability: params.sourceReliability,
        sourceUrls: params.sourceUrls,
        fastestPosterIds: [params.posterId, '', ''],
        commentCount: 0,
        savedCount: 0,
        tasukaruCount: 0,
        createdAt: now,
        updatedAt: now,
      })
      .go();

    return EventInfoDb.toDomain(result.data);
  }

  async findById(oshiId: OshiId, eventId: EventId): Promise<EventInfo | null> {
    const result = await EventInfoDb.entity.query.primary({ oshiId, eventId }).go();
    const record = result.data[0];
    return record ? EventInfoDb.toDomain(record) : null;
  }

  async findByOshi(
    oshiId: OshiId,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<EventInfo>> {
    const result = await EventInfoDb.entity.query.byOshi({ oshiId }).go({
      hydrate: true,
      order: 'desc',
      limit: pagination.limit,
      cursor: pagination.cursor ?? undefined,
    });

    return {
      items: result.data.map(EventInfoDb.toDomain),
      cursor: result.cursor ?? null,
    };
  }

  async findByOshiAndCategory(
    oshiId: OshiId,
    category: EventCategory,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<EventInfo>> {
    const result = await EventInfoDb.entity.query.byCategory({ oshiId, category }).go({
      hydrate: true,
      order: 'desc',
      limit: pagination.limit,
      cursor: pagination.cursor ?? undefined,
    });

    return {
      items: result.data.map(EventInfoDb.toDomain),
      cursor: result.cursor ?? null,
    };
  }
}
