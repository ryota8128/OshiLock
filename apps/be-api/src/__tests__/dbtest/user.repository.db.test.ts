import { describe, it, expect, beforeEach } from 'vitest';
import { Service } from 'electrodb';
import { UserId, USER_RANK } from '@oshilock/shared';
import { createTestDocumentClient } from './helpers/dynamodb-client.js';
import { cleanupTable } from './helpers/cleanup.js';
import { TABLE_NAME } from './helpers/table-definition.js';
import { UserDb } from '../../infrastructure/dynamo/entity/user.db.js';
import { UserSettingsDb } from '../../infrastructure/dynamo/entity/user-settings.db.js';

const docClient = createTestDocumentClient();

describe('User Repository (DynamoDB)', () => {
  beforeEach(async () => {
    await cleanupTable(docClient);
  });

  describe('create + findById', () => {
    it('ユーザーと Settings が作成される', async () => {
      const userId = UserId.generate();
      const now = new Date().toISOString();

      await UserDb.entity
        .create({
          userId,
          authProvider: 'APPLE',
          authSub: 'apple-sub-001',
          displayName: 'TestUser',
          rank: 'NO_RANK',
          createdAt: now,
          updatedAt: now,
        })
        .go();

      await UserSettingsDb.entity
        .create({
          userId,
          notification: { reminder: true, dailySummary: true },
        })
        .go();

      const userResult = await UserDb.entity.query.primary({ userId }).go();
      expect(userResult.data).toHaveLength(1);
      expect(userResult.data[0].displayName).toBe('TestUser');
      expect(userResult.data[0].authProvider).toBe('APPLE');

      const settingsResult = await UserSettingsDb.entity.query.primary({ userId }).go();
      expect(settingsResult.data).toHaveLength(1);
      expect(settingsResult.data[0].notification.reminder).toBe(true);
    });
  });

  describe('findByAuth (GSI)', () => {
    it('authProvider + authSub でユーザーを検索できる', async () => {
      const userId = UserId.generate();
      const now = new Date().toISOString();

      await UserDb.entity
        .create({
          userId,
          authProvider: 'APPLE',
          authSub: 'apple-sub-002',
          displayName: 'AuthUser',
          rank: 'NO_RANK',
          createdAt: now,
          updatedAt: now,
        })
        .go();

      const result = await UserDb.entity.query
        .byAuth({ authProvider: 'APPLE', authSub: 'apple-sub-002' })
        .go({ hydrate: true });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].userId).toBe(userId);
      expect(result.data[0].displayName).toBe('AuthUser');
    });

    it('存在しない authSub では空配列を返す', async () => {
      const result = await UserDb.entity.query
        .byAuth({ authProvider: 'APPLE', authSub: 'nonexistent' })
        .go({ hydrate: true });

      expect(result.data).toHaveLength(0);
    });
  });

  describe('transaction (User + Settings)', () => {
    it('トランザクションで User と Settings がアトミックに作成される', async () => {
      const service = new Service(
        { user: UserDb.entity, userSettings: UserSettingsDb.entity },
        { client: UserDb.entity.client, table: TABLE_NAME },
      );

      const userId = UserId.generate();
      const now = new Date().toISOString();

      const result = await service.transaction
        .write(({ user, userSettings }) => [
          user
            .create({
              userId,
              authProvider: 'GOOGLE',
              authSub: 'google-sub-001',
              displayName: 'TxUser',
              rank: 'NO_RANK',
              createdAt: now,
              updatedAt: now,
            })
            .where(({ userId }, { notExists }) => notExists(userId))
            .commit(),
          userSettings
            .create({
              userId,
              notification: { reminder: false, dailySummary: true },
            })
            .commit(),
        ])
        .go();

      expect(result.canceled).toBe(false);

      const userResult = await UserDb.entity.query.primary({ userId }).go();
      expect(userResult.data).toHaveLength(1);
      expect(userResult.data[0].displayName).toBe('TxUser');

      const settingsResult = await UserSettingsDb.entity.query.primary({ userId }).go();
      expect(settingsResult.data).toHaveLength(1);
      expect(settingsResult.data[0].notification.reminder).toBe(false);
    });

    it('同じ userId で2回作成するとトランザクションが失敗する', async () => {
      const service = new Service(
        { user: UserDb.entity, userSettings: UserSettingsDb.entity },
        { client: UserDb.entity.client, table: TABLE_NAME },
      );

      const userId = UserId.generate();
      const now = new Date().toISOString();

      // 1回目: 成功
      const first = await service.transaction
        .write(({ user, userSettings }) => [
          user
            .create({
              userId,
              authProvider: 'APPLE',
              authSub: 'apple-dup-001',
              displayName: 'First',
              rank: 'NO_RANK',
              createdAt: now,
              updatedAt: now,
            })
            .where(({ userId }, { notExists }) => notExists(userId))
            .commit(),
          userSettings
            .create({
              userId,
              notification: { reminder: true, dailySummary: true },
            })
            .commit(),
        ])
        .go();

      expect(first.canceled).toBe(false);

      // 2回目: 同じ userId → canceled
      const second = await service.transaction
        .write(({ user, userSettings }) => [
          user
            .create({
              userId,
              authProvider: 'APPLE',
              authSub: 'apple-dup-002',
              displayName: 'Second',
              rank: 'NO_RANK',
              createdAt: now,
              updatedAt: now,
            })
            .where(({ userId }, { notExists }) => notExists(userId))
            .commit(),
          userSettings
            .create({
              userId,
              notification: { reminder: true, dailySummary: true },
            })
            .commit(),
        ])
        .go();

      expect(second.canceled).toBe(true);

      // 1回目のデータが残っていることを確認
      const userResult = await UserDb.entity.query.primary({ userId }).go();
      expect(userResult.data[0].displayName).toBe('First');
    });
  });
});
