import type {
  EventInfo,
  EventId,
  OshiId,
  UserId,
  EventCategory,
  SourceReliability,
  PaginationParams,
  PaginatedResult,
} from '@oshilock/shared';
import type { AiParseResult } from '../value-objects/parse-result-json.js';
import type { AiMergeResult } from '../value-objects/ai-merge-result.js';

export type CreateEventInfoParams = {
  eventId: EventId;
  oshiId: OshiId;
  posterId: UserId;
  parseResult: AiParseResult;
  sourceUrls: string[];
  sourceReliability: SourceReliability;
};

export type UpdateFromMergeParams = {
  oshiId: OshiId;
  eventId: EventId;
  mergeResult: AiMergeResult;
  sourceUrls: string[];
};

export interface IEventInfoRepository {
  create(params: CreateEventInfoParams): Promise<EventInfo>;
  findById(oshiId: OshiId, eventId: EventId): Promise<EventInfo | null>;
  findByOshi(oshiId: OshiId, pagination: PaginationParams): Promise<PaginatedResult<EventInfo>>;
  findByOshiAndCategory(
    oshiId: OshiId,
    category: EventCategory,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<EventInfo>>;
  updateFromMerge(params: UpdateFromMergeParams): Promise<EventInfo>;
}
