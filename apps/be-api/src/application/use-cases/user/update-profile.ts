import type { UserId, UserWithAvatarUrl } from '@oshilock/shared';
import type { IUserRepository } from '../../../domain/repository/user.repository.interface.js';
import type { IStorageGateway } from '../../../domain/gateway/storage.gateway.interface.js';

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
    const user = await this.userRepository.updateProfile(input);
    const avatarUrl = user.avatarPath
      ? this.storageGateway.generateAvatarDisplayUrls(user.avatarPath)
      : null;

    return {
      ...user,
      avatarUrl: avatarUrl ? { sm: avatarUrl.avatarSmUrl, lg: avatarUrl.avatarLgUrl } : null,
    };
  }
}
