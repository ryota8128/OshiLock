import type { UserId } from '../../domain/value-objects/branded';

export type SignInResponse = {
  userId: UserId;
  isNewUser: boolean;
};
