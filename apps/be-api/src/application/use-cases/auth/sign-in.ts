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
      return { userId: existingUser.id, isNewUser: false };
    }

    const userId = UserId.generate();
    await this.userRepository.create({
      userId,
      authProvider: verified.authProvider,
      authSub: verified.authSub,
      displayName: verified.name || `User_${userId.slice(-6)}`,
    });

    return { userId, isNewUser: true };
  }
}
