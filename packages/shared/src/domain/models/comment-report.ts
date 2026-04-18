import { CommentId, UserId } from "../../types/branded";
import { UtcIsoString } from "../../types/utc-iso-string";
import { ReportCategory } from "../enum/report-category";

export interface CommentReport {
  userId: UserId;
  commentId: CommentId;
  category: ReportCategory;
  createdAt: UtcIsoString;
}
