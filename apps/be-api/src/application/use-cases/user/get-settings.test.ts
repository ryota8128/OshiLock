import { describe, expect, it, vi } from 'vitest';
import { GetSettingsUseCase } from './get-settings';
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

const MOCK_SETTINGS: UserSettings = {
  userId: USER_ID,
  notification: {
    reminder: true,
    dailySummary: false,
  },
};

describe('GetSettingsUseCase', () => {
  it('設定を取得できる', async () => {
    const repository = createMockUserSettingsRepository({
      findByUserId: vi.fn().mockResolvedValue(MOCK_SETTINGS),
    });
    const useCase = new GetSettingsUseCase(repository);

    const result = await useCase.execute(USER_ID);

    expect(result).toEqual(MOCK_SETTINGS);
    expect(repository.findByUserId).toHaveBeenCalledWith(USER_ID);
  });

  it('設定が見つからない場合 OshiLockBeException(404) をスローする', async () => {
    const repository = createMockUserSettingsRepository({
      findByUserId: vi.fn().mockResolvedValue(null),
    });
    const useCase = new GetSettingsUseCase(repository);

    await expect(useCase.execute(USER_ID)).rejects.toThrow('ユーザー設定が見つかりません');
  });
});
