import type { UserId, UserWithAvatarUrl } from '@oshilock/shared';
import type { IUserRepository } from '../../../domain/repository/user.repository.interface.js';
import type { IStorageGateway } from '../../../domain/gateway/storage.gateway.interface.js';
import { NotFoundException } from '../../../domain/errors/not-found.exception.js';

type UpdateProfileInput = {
  userId: UserId;
  displayName: string;
  avatarPath?: string | null;
};

export class UpdateProfileUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  async execute(input: UpdateProfileInput): Promise<UserWithAvatarUrl> {
    const oldUser = await this.userRepository.findById(input.userId);
    if (!oldUser) {
      throw new NotFoundException('ユーザーが見つかりません');
    }
    const oldAvatarPath = oldUser.avatarPath;

    const user = await this.userRepository.updateProfile(input);

    if (oldAvatarPath && input.avatarPath !== undefined) {
      try {
        await this.storageGateway.deleteAvatarImages(oldAvatarPath);
      } catch (e) {
        console.warn(`Failed to delete old avatar images: ${oldAvatarPath}`, e);
        // 削除失敗は握りつぶす
      }
    }

    const avatarUrl = user.avatarPath
      ? this.storageGateway.generateAvatarDisplayUrls(user.avatarPath)
      : null;

    return {
      ...user,
      avatarUrl: avatarUrl ? { sm: avatarUrl.avatarSmUrl, lg: avatarUrl.avatarLgUrl } : null,
    };
  }
}
