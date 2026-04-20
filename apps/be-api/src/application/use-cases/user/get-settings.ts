import type { UserId, UserSettings } from '@oshilock/shared';
import type { IUserSettingsRepository } from '../../../domain/repository/user-settings.repository.interface.js';
import { NotFoundException } from '../../../domain/errors/not-found.exception.js';

export class GetSettingsUseCase {
  constructor(private readonly userSettingsRepository: IUserSettingsRepository) {}

  async execute(userId: UserId): Promise<UserSettings> {
    const settings = await this.userSettingsRepository.findByUserId(userId);
    if (!settings) {
      throw new NotFoundException('ユーザー設定が見つかりません');
    }
    return settings;
  }
}
