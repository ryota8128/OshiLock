import type { UserId, UserSettings } from '@oshilock/shared';
import type { IUserSettingsRepository } from '../../../domain/repository/user-settings.repository.interface.js';

type UpdateSettingsInput = {
  userId: UserId;
  notification: {
    reminder?: boolean;
    dailySummary?: boolean;
  };
};

export class UpdateSettingsUseCase {
  constructor(private readonly userSettingsRepository: IUserSettingsRepository) {}

  async execute(input: UpdateSettingsInput): Promise<UserSettings> {
    return this.userSettingsRepository.update(input);
  }
}
