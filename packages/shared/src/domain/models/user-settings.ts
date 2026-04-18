import { UserId } from "../../types/branded";

export interface UserSettings {
  userId: UserId;
  notification: {
    reminder: boolean;
    dailySummary: boolean;
  };
}
