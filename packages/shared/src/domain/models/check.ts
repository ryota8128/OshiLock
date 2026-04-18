import { EventId, UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";

export interface Check {
  userId: UserId;
  eventId: EventId;
  createdAt: UtcIsoString;
}
