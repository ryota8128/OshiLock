import { describe, expect, it, vi } from 'vitest';
import { GenerateAvatarUploadUrlsUseCase } from './generate-avatar-upload-urls';
import type {
  IStorageGateway,
  AvatarPresignedUploadUrls,
} from '../../../domain/gateway/storage.gateway.interface';
import { UserId } from '@oshilock/shared';

function createMockStorageGateway(overrides: Partial<IStorageGateway> = {}): IStorageGateway {
  return {
    generateAvatarUploadUrls: vi.fn(),
    generateAvatarDisplayUrls: vi.fn(),
    ...overrides,
  };
}

const USER_ID = UserId.from('u_testUser123');

const MOCK_UPLOAD_URLS: AvatarPresignedUploadUrls = {
  avatarPath: 'avatars/u_testUser123/abc.jpg',
  smUploadUrl: 'https://s3.example.com/upload/sm',
  lgUploadUrl: 'https://s3.example.com/upload/lg',
};

describe('GenerateAvatarUploadUrlsUseCase', () => {
  it('storageGateway から presigned URLs を返す', async () => {
    const storageGateway = createMockStorageGateway({
      generateAvatarUploadUrls: vi.fn().mockResolvedValue(MOCK_UPLOAD_URLS),
    });

    const useCase = new GenerateAvatarUploadUrlsUseCase(storageGateway);
    const result = await useCase.execute(USER_ID);

    expect(result).toEqual(MOCK_UPLOAD_URLS);
  });

  it('userId を storageGateway に渡す', async () => {
    const storageGateway = createMockStorageGateway({
      generateAvatarUploadUrls: vi.fn().mockResolvedValue(MOCK_UPLOAD_URLS),
    });

    const useCase = new GenerateAvatarUploadUrlsUseCase(storageGateway);
    await useCase.execute(USER_ID);

    expect(storageGateway.generateAvatarUploadUrls).toHaveBeenCalledWith(USER_ID);
  });
});
