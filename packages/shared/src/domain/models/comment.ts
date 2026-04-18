import { EventId, CommentId, UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";

export interface Comment {
  id: CommentId;
  eventId: EventId;
  userId: UserId;
  body: string;
  likeCount: number;
  createdAt: UtcIsoString;
}
