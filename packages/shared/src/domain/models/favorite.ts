import { EventCardId, UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";

export interface Favorite {
  userId: UserId;
  eventCardId: EventCardId;
  createdAt: UtcIsoString;
}
