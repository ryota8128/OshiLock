import { EventId, CommentId, UserId } from '../value-objects/branded';
import { UtcIsoString } from '../value-objects/utc-iso-string';

export interface Comment {
  id: CommentId;
  eventId: EventId;
  userId: UserId;
  body: string;
  likeCount: number;
  createdAt: UtcIsoString;
}
