import { EventId, CommentId, UserId } from '../../types/branded';
import { UtcIsoString } from '../value-objects/utc-iso-string';

export interface Comment {
  id: CommentId;
  eventId: EventId;
  userId: UserId;
  body: string;
  likeCount: number;
  createdAt: UtcIsoString;
}
