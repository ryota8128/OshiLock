import { SourceReliability } from '../enum/source-reliability';
import { EventId, OshiId, UserId } from '../value-objects/branded';
import { EventCategory } from '../enum/event-category';
import { DateString } from '../value-objects/date-string';
import { TimeString } from '../value-objects/time-string';
import { UtcIsoString } from '../value-objects/utc-iso-string';

export interface EventInfo {
  id: EventId;
  oshiId: OshiId;
  title: string;
  schedule: {
    startDate: DateString | null;
    startTime: TimeString | null;
    endDate: DateString | null;
    endTime: TimeString | null;
  };
  summary: string;
  content: string;
  category: EventCategory;
  sourceReliability: SourceReliability;
  sourceUrls: string[];
  fastestPosterIds: [UserId | null, UserId | null, UserId | null];
  commentCount: number;
  savedCount: number;
  tasukaruCount: number;
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}

export interface EventInfoWithUserContext extends EventInfo {
  isRead: boolean;
  saved: boolean;
  tasukatta: boolean;
}
