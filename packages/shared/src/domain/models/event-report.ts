import { EventId as EventId, UserId } from '../value-objects/branded';
import { UtcIsoString } from '../value-objects/utc-iso-string';
import { ReportCategory } from '../enum/report-category';

export interface EventReport {
  userId: UserId;
  eventId: EventId;
  category: ReportCategory;
  createdAt: UtcIsoString;
}
