import { SourceReliability } from '../enum/source-reliability';
import { EventId, OshiId, UserId } from '../value-objects/branded';
import { EventCategory } from '../enum/event-category';
import { UtcIsoString } from '../value-objects/utc-iso-string';

export interface EventInfo {
  id: EventId;
  oshiId: OshiId;
  title: string;
  schedule: {
    datetime: UtcIsoString | null;
    hasTime: boolean;
  };
  content: string;
  category: EventCategory;
  sourceReliability: SourceReliability;
  sourceUrls: string[];
  fastestPosterIds: [UserId | null, UserId | null, UserId | null];
  commentCount: number;
  favoriteCount: number;
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}

export interface EventInfoWithUserContext extends EventInfo {
  isRead: boolean;
  checked: boolean;
}
