import type { IAuthGateway } from '../../../domain/gateway/auth.gateway.interface.js';
import type { IUserRepository } from '../../../domain/repository/user.repository.interface.js';
import { UserId } from '@oshilock/shared';

type SignInResult = {
  userId: UserId;
  isNewUser: boolean;
};

export class SignInUseCase {
  constructor(
    private readonly authGateway: IAuthGateway,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(firebaseIdToken: string): Promise<SignInResult> {
    const verified = await this.authGateway.verifyIdToken(firebaseIdToken);

    const existingUser = await this.userRepository.findByAuth(
      verified.authProvider,
      verified.authSub,
    );

    if (existingUser) {
      // 既存ユーザー: claims が未設定の場合のみ設定（移行用）
      if (!verified.userId) {
        await this.authGateway.setCustomClaims(verified.uid, { userId: existingUser.id });
      }
      return { userId: existingUser.id, isNewUser: false };
    }

    const userId = UserId.generate();
    await this.userRepository.create({
      userId,
      authProvider: verified.authProvider,
      authSub: verified.authSub,
      displayName: verified.name || `User_${userId.slice(-6)}`,
    });

    // Firebase token に userId を埋め込む
    await this.authGateway.setCustomClaims(verified.uid, { userId });

    return { userId, isNewUser: true };
  }
}
