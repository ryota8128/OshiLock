import { describe, expect, it, vi } from 'vitest';
import { SignInUseCase } from './sign-in';
import type { IAuthGateway, VerifiedToken } from '../../../domain/gateway/auth.gateway.interface';
import type { IUserRepository } from '../../../domain/repository/user.repository.interface';
import type { User } from '@oshilock/shared';
import { UserId } from '@oshilock/shared';

function createMockAuthGateway(overrides: Partial<IAuthGateway> = {}): IAuthGateway {
  return {
    verifyIdToken: vi.fn(),
    setCustomClaims: vi.fn(),
    ...overrides,
  };
}

function createMockUserRepository(overrides: Partial<IUserRepository> = {}): IUserRepository {
  return {
    findByAuth: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    updateProfile: vi.fn(),
    ...overrides,
  };
}

const MOCK_VERIFIED_TOKEN: VerifiedToken = {
  uid: 'firebase-uid-123',
  userId: 'u_existingUserId',
  authProvider: 'APPLE',
  authSub: 'apple-sub-123',
  email: 'test@example.com',
  name: 'Test User',
};

const MOCK_USER: User = {
  id: UserId.from('u_existingUserId'),
  authProvider: 'APPLE',
  authSub: 'apple-sub-123',
  displayName: 'Test User',
  avatarPath: null,
  rank: 'NO_RANK',
  createdAt: '2026-01-01T00:00:00.000Z' as never,
  updatedAt: '2026-01-01T00:00:00.000Z' as never,
};

describe('SignInUseCase', () => {
  describe('既存ユーザーの場合', () => {
    it('userId と isNewUser: false を返す', async () => {
      const authGateway = createMockAuthGateway({
        verifyIdToken: vi.fn().mockResolvedValue(MOCK_VERIFIED_TOKEN),
      });
      const userRepository = createMockUserRepository({
        findByAuth: vi.fn().mockResolvedValue(MOCK_USER),
      });

      const useCase = new SignInUseCase(authGateway, userRepository);
      const result = await useCase.execute('dummy-token');

      expect(result).toEqual({
        userId: MOCK_USER.id,
        isNewUser: false,
      });
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('claims が設定済みの場合は setCustomClaims を呼ばない', async () => {
      const authGateway = createMockAuthGateway({
        verifyIdToken: vi.fn().mockResolvedValue(MOCK_VERIFIED_TOKEN),
      });
      const userRepository = createMockUserRepository({
        findByAuth: vi.fn().mockResolvedValue(MOCK_USER),
      });

      const useCase = new SignInUseCase(authGateway, userRepository);
      await useCase.execute('dummy-token');

      expect(authGateway.setCustomClaims).not.toHaveBeenCalled();
    });

    it('claims が未設定の場合は setCustomClaims を呼ぶ', async () => {
      const tokenWithoutClaims: VerifiedToken = {
        ...MOCK_VERIFIED_TOKEN,
        userId: null,
      };
      const authGateway = createMockAuthGateway({
        verifyIdToken: vi.fn().mockResolvedValue(tokenWithoutClaims),
      });
      const userRepository = createMockUserRepository({
        findByAuth: vi.fn().mockResolvedValue(MOCK_USER),
      });

      const useCase = new SignInUseCase(authGateway, userRepository);
      await useCase.execute('dummy-token');

      expect(authGateway.setCustomClaims).toHaveBeenCalledWith(tokenWithoutClaims.uid, {
        userId: MOCK_USER.id,
      });
    });
  });

  describe('新規ユーザーの場合', () => {
    it('ユーザーを作成し isNewUser: true を返す', async () => {
      const authGateway = createMockAuthGateway({
        verifyIdToken: vi.fn().mockResolvedValue(MOCK_VERIFIED_TOKEN),
      });
      const userRepository = createMockUserRepository({
        findByAuth: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(MOCK_USER),
      });

      const useCase = new SignInUseCase(authGateway, userRepository);
      const result = await useCase.execute('dummy-token');

      expect(result.isNewUser).toBe(true);
      expect(result.userId).toMatch(/^u_/);
      expect(userRepository.create).toHaveBeenCalledOnce();
    });

    it('setCustomClaims に生成した userId を渡す', async () => {
      const authGateway = createMockAuthGateway({
        verifyIdToken: vi.fn().mockResolvedValue(MOCK_VERIFIED_TOKEN),
      });
      const userRepository = createMockUserRepository({
        findByAuth: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(MOCK_USER),
      });

      const useCase = new SignInUseCase(authGateway, userRepository);
      const result = await useCase.execute('dummy-token');

      expect(authGateway.setCustomClaims).toHaveBeenCalledWith(MOCK_VERIFIED_TOKEN.uid, {
        userId: result.userId,
      });
    });

    it('name が null の場合はフォールバック表示名を使う', async () => {
      const tokenWithoutName: VerifiedToken = {
        ...MOCK_VERIFIED_TOKEN,
        name: null,
      };
      const authGateway = createMockAuthGateway({
        verifyIdToken: vi.fn().mockResolvedValue(tokenWithoutName),
      });
      const userRepository = createMockUserRepository({
        findByAuth: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(MOCK_USER),
      });

      const useCase = new SignInUseCase(authGateway, userRepository);
      await useCase.execute('dummy-token');

      const createCall = vi.mocked(userRepository.create).mock.calls[0][0];
      expect(createCall.displayName).toMatch(/^User_/);
    });
  });
});
