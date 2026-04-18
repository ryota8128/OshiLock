import { SourceReliability } from "../enum/source-reliability";
import { EventCardId, OshiId, UserId } from "../../types/branded";
import { EventCategory } from "../enum/event-category";
import { UtcIsoString } from "../../types/utc-iso-string";

export interface EventCard {
  id: EventCardId;
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
  firstPosterIds: [UserId | null, UserId | null, UserId | null];
  commentCount: number;
  favoriteCount: number;
  isRead: boolean;
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}
