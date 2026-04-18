import { EventCardId, CommentId, UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";

export interface Comment {
  id: CommentId;
  eventCardId: EventCardId;
  userId: UserId;
  body: string;
  likeCount: number;
  createdAt: UtcIsoString;
}
