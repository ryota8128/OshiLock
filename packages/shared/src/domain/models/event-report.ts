import { EventId as EventId, UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";
import { ReportCategory } from "../enum/report-category";

export interface EventReport {
  userId: UserId;
  eventId: EventId;
  category: ReportCategory;
  createdAt: UtcIsoString;
}
