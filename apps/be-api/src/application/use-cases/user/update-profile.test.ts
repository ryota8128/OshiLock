import { describe, expect, it, vi } from 'vitest';
import { UpdateProfileUseCase } from './update-profile';
import type { IUserRepository } from '../../../domain/repository/user.repository.interface';
import type { IStorageGateway } from '../../../domain/gateway/storage.gateway.interface';
import type { User } from '@oshilock/shared';
import { UserId } from '@oshilock/shared';

function createMockUserRepository(overrides: Partial<IUserRepository> = {}): IUserRepository {
  return {
    findByAuth: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    updateProfile: vi.fn(),
    ...overrides,
  };
}

function createMockStorageGateway(overrides: Partial<IStorageGateway> = {}): IStorageGateway {
  return {
    generateAvatarUploadUrls: vi.fn(),
    generateAvatarDisplayUrls: vi.fn(),
    deleteAvatarImages: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

const USER_ID = UserId.from('u_testUser123');

const MOCK_USER: User = {
  id: USER_ID,
  authProvider: 'APPLE',
  authSub: 'apple-sub-123',
  displayName: 'Updated Name',
  avatarPath: null,
  rank: 'NO_RANK',
  createdAt: '2026-01-01T00:00:00.000Z' as never,
  updatedAt: '2026-01-01T00:00:00.000Z' as never,
};

describe('UpdateProfileUseCase', () => {
  it('avatarPath がある場合 avatarUrl に sm/lg を含む', async () => {
    const userWithAvatar: User = {
      ...MOCK_USER,
      avatarPath: 'avatars/u_testUser123/original.jpg',
    };
    const userRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(MOCK_USER),
      updateProfile: vi.fn().mockResolvedValue(userWithAvatar),
    });
    const storageGateway = createMockStorageGateway({
      generateAvatarDisplayUrls: vi.fn().mockReturnValue({
        avatarSmUrl: 'https://cdn.example.com/sm.jpg',
        avatarLgUrl: 'https://cdn.example.com/lg.jpg',
      }),
    });

    const useCase = new UpdateProfileUseCase(userRepository, storageGateway);
    const result = await useCase.execute({
      userId: USER_ID,
      displayName: 'Updated Name',
      avatarPath: 'avatars/u_testUser123/original.jpg',
    });

    expect(result.avatarUrl).toEqual({
      sm: 'https://cdn.example.com/sm.jpg',
      lg: 'https://cdn.example.com/lg.jpg',
    });
    expect(storageGateway.generateAvatarDisplayUrls).toHaveBeenCalledWith(
      'avatars/u_testUser123/original.jpg',
    );
  });

  it('avatarPath がない場合 avatarUrl は null', async () => {
    const userRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(MOCK_USER),
      updateProfile: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const storageGateway = createMockStorageGateway();

    const useCase = new UpdateProfileUseCase(userRepository, storageGateway);
    const result = await useCase.execute({
      userId: USER_ID,
      displayName: 'Updated Name',
    });

    expect(result.avatarUrl).toBeNull();
    expect(storageGateway.generateAvatarDisplayUrls).not.toHaveBeenCalled();
  });

  it('ユーザーが存在しない場合 NotFoundException をスローする', async () => {
    const userRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(null),
    });
    const storageGateway = createMockStorageGateway();

    const useCase = new UpdateProfileUseCase(userRepository, storageGateway);

    await expect(useCase.execute({ userId: USER_ID, displayName: 'Name' })).rejects.toThrow(
      'ユーザーが見つかりません',
    );
    expect(userRepository.updateProfile).not.toHaveBeenCalled();
  });

  it('updateProfile に正しいパラメータを渡す', async () => {
    const userRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(MOCK_USER),
      updateProfile: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const storageGateway = createMockStorageGateway();

    const useCase = new UpdateProfileUseCase(userRepository, storageGateway);
    await useCase.execute({
      userId: USER_ID,
      displayName: 'New Name',
      avatarPath: 'some/path.jpg',
    });

    expect(userRepository.updateProfile).toHaveBeenCalledWith({
      userId: USER_ID,
      displayName: 'New Name',
      avatarPath: 'some/path.jpg',
    });
  });

  it('アバター変更時に旧画像が削除される', async () => {
    const oldUser: User = { ...MOCK_USER, avatarPath: 'avatars/u_testUser123/old_hash' };
    const newUser: User = { ...MOCK_USER, avatarPath: 'avatars/u_testUser123/new_hash' };
    const userRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(oldUser),
      updateProfile: vi.fn().mockResolvedValue(newUser),
    });
    const storageGateway = createMockStorageGateway({
      generateAvatarDisplayUrls: vi.fn().mockReturnValue({
        avatarSmUrl: 'https://cdn.example.com/sm.webp',
        avatarLgUrl: 'https://cdn.example.com/lg.webp',
      }),
    });

    const useCase = new UpdateProfileUseCase(userRepository, storageGateway);
    await useCase.execute({
      userId: USER_ID,
      displayName: 'Name',
      avatarPath: 'avatars/u_testUser123/new_hash',
    });

    expect(storageGateway.deleteAvatarImages).toHaveBeenCalledWith(
      'avatars/u_testUser123/old_hash',
    );
  });

  it('アバター未変更時は削除されない', async () => {
    const userRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(MOCK_USER),
      updateProfile: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const storageGateway = createMockStorageGateway();

    const useCase = new UpdateProfileUseCase(userRepository, storageGateway);
    await useCase.execute({ userId: USER_ID, displayName: 'Name' });

    expect(storageGateway.deleteAvatarImages).not.toHaveBeenCalled();
  });

  it('旧アバターがない場合は削除されない', async () => {
    const newUser: User = { ...MOCK_USER, avatarPath: 'avatars/u_testUser123/new_hash' };
    const userRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(MOCK_USER),
      updateProfile: vi.fn().mockResolvedValue(newUser),
    });
    const storageGateway = createMockStorageGateway({
      generateAvatarDisplayUrls: vi.fn().mockReturnValue({
        avatarSmUrl: 'https://cdn.example.com/sm.webp',
        avatarLgUrl: 'https://cdn.example.com/lg.webp',
      }),
    });

    const useCase = new UpdateProfileUseCase(userRepository, storageGateway);
    await useCase.execute({
      userId: USER_ID,
      displayName: 'Name',
      avatarPath: 'avatars/u_testUser123/new_hash',
    });

    expect(storageGateway.deleteAvatarImages).not.toHaveBeenCalled();
  });

  it('削除失敗でもプロフィール更新は成功する', async () => {
    const oldUser: User = { ...MOCK_USER, avatarPath: 'avatars/u_testUser123/old_hash' };
    const newUser: User = { ...MOCK_USER, avatarPath: 'avatars/u_testUser123/new_hash' };
    const userRepository = createMockUserRepository({
      findById: vi.fn().mockResolvedValue(oldUser),
      updateProfile: vi.fn().mockResolvedValue(newUser),
    });
    const storageGateway = createMockStorageGateway({
      deleteAvatarImages: vi.fn().mockRejectedValue(new Error('S3 error')),
      generateAvatarDisplayUrls: vi.fn().mockReturnValue({
        avatarSmUrl: 'https://cdn.example.com/sm.webp',
        avatarLgUrl: 'https://cdn.example.com/lg.webp',
      }),
    });

    const useCase = new UpdateProfileUseCase(userRepository, storageGateway);
    const result = await useCase.execute({
      userId: USER_ID,
      displayName: 'Name',
      avatarPath: 'avatars/u_testUser123/new_hash',
    });

    expect(result.avatarPath).toBe('avatars/u_testUser123/new_hash');
    expect(storageGateway.deleteAvatarImages).toHaveBeenCalled();
  });
});
