import { type AuthProvider, type User, UserId, USER_RANK, UtcIsoString } from '@oshilock/shared';
import { TransactionCanceledException } from '../../../domain/errors/transaction-canceled.exception.js';
import { OshiLockBeException } from '../../../domain/errors/oshilock-be.exception.js';
import type {
  CreateUserParams,
  UpdateProfileParams,
  IUserRepository,
} from '../../../domain/repository/user.repository.interface.js';
import { UserDb } from '../entity/user.db.js';
import { userRegistrationService } from '../service/user-registration.service.js';

export class DynamoUserRepository implements IUserRepository {
  async findByAuth(authProvider: AuthProvider, authSub: string): Promise<User | null> {
    const result = await UserDb.entity.query
      .byAuth({ authProvider, authSub })
      .go({ hydrate: true });
    const record = result.data[0];
    return record ? UserDb.toDomain(record) : null;
  }

  async findById(userId: string): Promise<User | null> {
    const result = await UserDb.entity.query.primary({ userId }).go();
    const record = result.data[0];
    return record ? UserDb.toDomain(record) : null;
  }

  async create(params: CreateUserParams): Promise<User> {
    const now = UtcIsoString.now();

    const result = await userRegistrationService.transaction
      .write(({ user, userSettings }) => [
        user
          .create({
            userId: params.userId,
            authProvider: params.authProvider,
            authSub: params.authSub,
            displayName: params.displayName,
            rank: USER_RANK.NO_RANK,
            createdAt: now,
            updatedAt: now,
          })
          .where(({ userId }, { notExists }) => notExists(userId))
          .commit(),
        userSettings
          .create({
            userId: params.userId,
            notification: {
              reminder: true,
              dailySummary: true,
            },
          })
          .where(({ userId }, { notExists }) => notExists(userId))
          .commit(),
      ])
      .go();

    if (result.canceled) {
      throw new TransactionCanceledException('ユーザー登録トランザクションが失敗しました');
    }

    return {
      id: params.userId,
      authProvider: params.authProvider,
      authSub: params.authSub,
      displayName: params.displayName,
      avatarPath: null,
      rank: USER_RANK.NO_RANK,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updateProfile(params: UpdateProfileParams): Promise<User> {
    const now = UtcIsoString.now();

    const result = await UserDb.entity
      .patch({ userId: params.userId })
      .set({
        displayName: params.displayName,
        avatarPath: params.avatarPath ?? undefined,
        updatedAt: now,
      })
      .go({ response: 'all_new' });

    return UserDb.toDomain(result.data);
  }
}
