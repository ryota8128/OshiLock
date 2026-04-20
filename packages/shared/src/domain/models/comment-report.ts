import { CommentId, UserId } from '../../types/branded';
import { UtcIsoString } from '../value-objects/utc-iso-string';
import { ReportCategory } from '../enum/report-category';

export interface CommentReport {
  userId: UserId;
  commentId: CommentId;
  category: ReportCategory;
  createdAt: UtcIsoString;
}
