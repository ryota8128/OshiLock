import { describe, it, expect, beforeEach } from 'vitest';
import { AUTH_PROVIDER, UserId } from '@oshilock/shared';
import { DynamoUserRepository } from '../../infrastructure/dynamo/repository/user.repository.js';
import { DynamoUserSettingsRepository } from '../../infrastructure/dynamo/repository/user-settings.repository.js';
import { createTestDocumentClient } from './helpers/dynamodb-client.js';
import { cleanupTable } from './helpers/cleanup.js';

const docClient = createTestDocumentClient();
const userRepository = new DynamoUserRepository();
const repository = new DynamoUserSettingsRepository();

async function createUser(userId: UserId) {
  await userRepository.create({
    userId,
    authProvider: AUTH_PROVIDER.APPLE,
    authSub: `apple-sub-${userId}`,
    displayName: 'TestUser',
  });
}

describe('DynamoUserSettingsRepository', () => {
  beforeEach(async () => {
    await cleanupTable(docClient);
  });

  describe('findByUserId', () => {
    it('ユーザー作成時に初期化された設定を取得できる', async () => {
      const userId = UserId.generate();
      await createUser(userId);

      const settings = await repository.findByUserId(userId);

      expect(settings).not.toBeNull();
      expect(settings!.userId).toBe(userId);
      expect(settings!.notification.reminder).toBe(true);
      expect(settings!.notification.dailySummary).toBe(true);
    });

    it('存在しない userId では null を返す', async () => {
      const settings = await repository.findByUserId(UserId.from('u_nonexistent'));
      expect(settings).toBeNull();
    });
  });

  describe('update', () => {
    it('reminder のみ更新できる', async () => {
      const userId = UserId.generate();
      await createUser(userId);

      const settings = await repository.update({
        userId,
        notification: { reminder: false },
      });

      expect(settings.notification.reminder).toBe(false);
      expect(settings.notification.dailySummary).toBe(true);
    });

    it('dailySummary のみ更新できる', async () => {
      const userId = UserId.generate();
      await createUser(userId);

      const settings = await repository.update({
        userId,
        notification: { dailySummary: false },
      });

      expect(settings.notification.reminder).toBe(true);
      expect(settings.notification.dailySummary).toBe(false);
    });

    it('両方同時に更新できる', async () => {
      const userId = UserId.generate();
      await createUser(userId);

      const settings = await repository.update({
        userId,
        notification: { reminder: false, dailySummary: false },
      });

      expect(settings.notification.reminder).toBe(false);
      expect(settings.notification.dailySummary).toBe(false);
    });

    it('存在しない userId で更新するとエラーになる', async () => {
      await expect(
        repository.update({
          userId: UserId.from('u_nonexistent'),
          notification: { reminder: false },
        }),
      ).rejects.toThrow();
    });
  });
});
