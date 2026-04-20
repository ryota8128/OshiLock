import type { UserSettings, UserId } from '@oshilock/shared';
import type {
  UpdateUserSettingsParams,
  IUserSettingsRepository,
} from '../../../domain/repository/user-settings.repository.interface.js';
import { UserSettingsDb } from '../entity/user-settings.db.js';
import { pickDefined } from '../utils.js';

export class DynamoUserSettingsRepository implements IUserSettingsRepository {
  async findByUserId(userId: UserId): Promise<UserSettings | null> {
    const result = await UserSettingsDb.entity.query.primary({ userId }).go();
    const record = result.data[0];
    return record ? UserSettingsDb.toDomain(record) : null;
  }

  async update(params: UpdateUserSettingsParams): Promise<UserSettings> {
    const result = await UserSettingsDb.entity
      .patch({ userId: params.userId })
      .set({ notification: pickDefined(params.notification) })
      .go({ response: 'all_new' });

    return UserSettingsDb.toDomain(result.data);
  }
}
