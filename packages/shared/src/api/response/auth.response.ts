import type { UserId } from '../../types/branded';

export type SignInResponse = {
  userId: UserId;
  isNewUser: boolean;
};
