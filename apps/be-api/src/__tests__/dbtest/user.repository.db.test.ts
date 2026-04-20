import { describe, it, expect, beforeEach } from 'vitest';
import { AUTH_PROVIDER, UserId } from '@oshilock/shared';
import { TransactionCanceledException } from '../../domain/errors/transaction-canceled.exception.js';
import { DynamoUserRepository } from '../../infrastructure/dynamo/repository/user.repository.js';
import { UserDb } from '../../infrastructure/dynamo/entity/user.db.js';
import { UserSettingsDb } from '../../infrastructure/dynamo/entity/user-settings.db.js';
import { createTestDocumentClient } from './helpers/dynamodb-client.js';
import { cleanupTable } from './helpers/cleanup.js';

const docClient = createTestDocumentClient();
const repository = new DynamoUserRepository();

describe('DynamoUserRepository', () => {
  beforeEach(async () => {
    await cleanupTable(docClient);
  });

  describe('create', () => {
    it('ユーザーを作成して返す', async () => {
      const userId = UserId.generate();

      const user = await repository.create({
        userId,
        authProvider: AUTH_PROVIDER.APPLE,
        authSub: 'apple-sub-001',
        displayName: 'TestUser',
      });

      expect(user.id).toBe(userId);
      expect(user.displayName).toBe('TestUser');
      expect(user.authProvider).toBe('APPLE');
      expect(user.rank).toBe('NO_RANK');
      expect(user.avatarUrl).toBeNull();
    });

    it('同じ userId で2回作成すると TransactionCanceledException がスローされる', async () => {
      const userId = UserId.generate();

      await repository.create({
        userId,
        authProvider: AUTH_PROVIDER.APPLE,
        authSub: 'apple-sub-dup-001',
        displayName: 'First',
      });

      await expect(
        repository.create({
          userId,
          authProvider: AUTH_PROVIDER.APPLE,
          authSub: 'apple-sub-dup-002',
          displayName: 'Second',
        }),
      ).rejects.toThrow(TransactionCanceledException);
    });
  });

  describe('findById', () => {
    it('作成したユーザーを ID で取得できる', async () => {
      const userId = UserId.generate();

      await repository.create({
        userId,
        authProvider: AUTH_PROVIDER.GOOGLE,
        authSub: 'google-sub-001',
        displayName: 'FindUser',
      });

      const user = await repository.findById(userId);

      expect(user).not.toBeNull();
      expect(user!.id).toBe(userId);
      expect(user!.displayName).toBe('FindUser');
    });

    it('存在しない userId では null を返す', async () => {
      const user = await repository.findById('u_nonexistent');
      expect(user).toBeNull();
    });
  });

  describe('findByAuth', () => {
    it('authProvider + authSub でユーザーを検索できる', async () => {
      const userId = UserId.generate();

      await repository.create({
        userId,
        authProvider: AUTH_PROVIDER.APPLE,
        authSub: 'apple-sub-find-001',
        displayName: 'AuthUser',
      });

      const user = await repository.findByAuth(AUTH_PROVIDER.APPLE, 'apple-sub-find-001');

      expect(user).not.toBeNull();
      expect(user!.id).toBe(userId);
      expect(user!.displayName).toBe('AuthUser');
    });

    it('存在しない authSub では null を返す', async () => {
      const user = await repository.findByAuth(AUTH_PROVIDER.APPLE, 'nonexistent');
      expect(user).toBeNull();
    });
  });

  describe('重複チェック', () => {
    it('同じ userId で作成済みの場合、1回目のデータが保持される', async () => {
      const userId = UserId.generate();

      await repository.create({
        userId,
        authProvider: AUTH_PROVIDER.APPLE,
        authSub: 'apple-sub-keep-001',
        displayName: 'Original',
      });

      await expect(
        repository.create({
          userId,
          authProvider: AUTH_PROVIDER.APPLE,
          authSub: 'apple-sub-keep-002',
          displayName: 'Duplicate',
        }),
      ).rejects.toThrow();

      const user = await repository.findById(userId);
      expect(user!.displayName).toBe('Original');
    });

    it('トランザクション失敗時に Settings もロールバックされる', async () => {
      const userId = UserId.generate();
      const now = new Date().toISOString();

      // User だけ先に直接作成（Settings なし）
      await UserDb.entity
        .create({
          userId,
          authProvider: 'APPLE',
          authSub: 'apple-sub-rollback-001',
          displayName: 'Existing',
          rank: 'NO_RANK',
          createdAt: now,
          updatedAt: now,
        })
        .go();

      // repository.create でトランザクション実行 → User の notExists で失敗
      await expect(
        repository.create({
          userId,
          authProvider: AUTH_PROVIDER.APPLE,
          authSub: 'apple-sub-rollback-002',
          displayName: 'ShouldFail',
        }),
      ).rejects.toThrow(TransactionCanceledException);

      // Settings が作成されていないことを確認（ロールバック）
      const settingsResult = await UserSettingsDb.entity.query.primary({ userId }).go();
      expect(settingsResult.data).toHaveLength(0);
    });
    it('Settings 側の重複で失敗した場合、User もロールバックされる', async () => {
      const userId = UserId.generate();

      // Settings だけ先に直接作成（User なし）
      await UserSettingsDb.entity
        .create({
          userId,
          notification: { reminder: true, dailySummary: true },
        })
        .go();

      // repository.create でトランザクション実行 → Settings の create が重複で失敗
      await expect(
        repository.create({
          userId,
          authProvider: AUTH_PROVIDER.APPLE,
          authSub: 'apple-sub-rollback-settings-001',
          displayName: 'ShouldNotExist',
        }),
      ).rejects.toThrow(TransactionCanceledException);

      // User が作成されていないことを確認（ロールバック）
      const user = await repository.findById(userId);
      expect(user).toBeNull();
    });
  });
});
