import type { User, AuthProvider } from '@oshilock/shared';

export type CreateUserParams = {
  userId: string;
  authProvider: AuthProvider;
  authSub: string;
  displayName: string;
};

export interface IUserRepository {
  findByAuth(authProvider: AuthProvider, authSub: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  create(params: CreateUserParams): Promise<User | null>;
}
