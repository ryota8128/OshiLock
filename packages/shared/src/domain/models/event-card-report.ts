import { EventCardId, UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";
import { ReportCategory } from "../enum/report-category";

export interface EventCardReport {
  userId: UserId;
  eventCardId: EventCardId;
  category: ReportCategory;
  createdAt: UtcIsoString;
}
