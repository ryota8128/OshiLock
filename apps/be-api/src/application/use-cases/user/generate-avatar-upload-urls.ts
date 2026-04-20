import type { UserId } from '@oshilock/shared';
import type {
  IStorageGateway,
  AvatarPresignedUploadUrls,
} from '../../../domain/gateway/storage.gateway.interface.js';

export class GenerateAvatarUploadUrlsUseCase {
  constructor(private readonly storageGateway: IStorageGateway) {}

  async execute(userId: UserId): Promise<AvatarPresignedUploadUrls> {
    return this.storageGateway.generateAvatarUploadUrls(userId);
  }
}
