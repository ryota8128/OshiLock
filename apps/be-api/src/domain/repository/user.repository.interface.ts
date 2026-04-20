import type { User, AuthProvider, UserId } from '@oshilock/shared';

export type CreateUserParams = {
  userId: UserId;
  authProvider: AuthProvider;
  authSub: string;
  displayName: string;
};

export type UpdateProfileParams = {
  userId: UserId;
  displayName: string;
  avatarPath: string | null;
};

export interface IUserRepository {
  findByAuth(authProvider: AuthProvider, authSub: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  create(params: CreateUserParams): Promise<User>;
  updateProfile(params: UpdateProfileParams): Promise<User>;
}
