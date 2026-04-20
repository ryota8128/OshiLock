import type { UserSettings, UserId } from '@oshilock/shared';

export type UpdateUserSettingsParams = {
  userId: UserId;
  notification: {
    reminder?: boolean;
    dailySummary?: boolean;
  };
};

export interface IUserSettingsRepository {
  findByUserId(userId: UserId): Promise<UserSettings | null>;
  update(params: UpdateUserSettingsParams): Promise<UserSettings>;
}
