import { EventId, UserId } from '../value-objects/branded';
import { UtcIsoString } from '../value-objects/utc-iso-string';

export interface Save {
  userId: UserId;
  eventId: EventId;
  createdAt: UtcIsoString;
}
