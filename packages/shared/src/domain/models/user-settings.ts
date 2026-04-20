import { UserId } from '../value-objects/branded';

export interface UserSettings {
  userId: UserId;
  notification: {
    reminder: boolean;
    dailySummary: boolean;
  };
}
