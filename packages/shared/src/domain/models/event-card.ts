import { SourceReliability } from "../enum/source-reliability";
import { OshiId, UserId } from "../../types/branded";
import { EventCategory } from "../enum/event-category";
import { UtcIsoString } from "../../types/utc-iso-string";

export interface EventCard {
  id: string;
  oshiId: OshiId;
  title: string;
  date: UtcIsoString;
  content: string;
  category: EventCategory;
  sourceReliability: SourceReliability;
  sourceUrls: string[];
  firstPosterIds: [UserId | null, UserId | null, UserId | null];
  commentCount: number;
  favoriteCount: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
