import { EventInfoId, UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";

export interface Check {
  userId: UserId;
  eventInfoId: EventInfoId;
  createdAt: UtcIsoString;
}
