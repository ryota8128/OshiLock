import { describe, expect, it, vi } from 'vitest';
import { UpdateSettingsUseCase } from './update-settings';
import type { IUserSettingsRepository } from '../../../domain/repository/user-settings.repository.interface';
import type { UserSettings } from '@oshilock/shared';
import { UserId } from '@oshilock/shared';

function createMockUserSettingsRepository(
  overrides: Partial<IUserSettingsRepository> = {},
): IUserSettingsRepository {
  return {
    findByUserId: vi.fn(),
    update: vi.fn(),
    ...overrides,
  };
}

const USER_ID = UserId.from('u_testUser123');

describe('UpdateSettingsUseCase', () => {
  it('設定を更新して結果を返す', async () => {
    const updatedSettings: UserSettings = {
      userId: USER_ID,
      notification: {
        reminder: false,
        dailySummary: true,
      },
    };
    const repository = createMockUserSettingsRepository({
      update: vi.fn().mockResolvedValue(updatedSettings),
    });
    const useCase = new UpdateSettingsUseCase(repository);

    const result = await useCase.execute({
      userId: USER_ID,
      notification: { reminder: false, dailySummary: true },
    });

    expect(result).toEqual(updatedSettings);
    expect(repository.update).toHaveBeenCalledWith({
      userId: USER_ID,
      notification: { reminder: false, dailySummary: true },
    });
  });
});
