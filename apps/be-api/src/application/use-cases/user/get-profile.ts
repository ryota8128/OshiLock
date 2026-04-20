import type { UserId, UserWithAvatarUrl } from '@oshilock/shared';
import type { IUserRepository } from '../../../domain/repository/user.repository.interface.js';
import type { IStorageGateway } from '../../../domain/gateway/storage.gateway.interface.js';
import { NotFoundException } from '../../../domain/errors/not-found.exception.js';

export class GetProfileUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  async execute(userId: UserId): Promise<UserWithAvatarUrl> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('ユーザーが見つかりません');
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
