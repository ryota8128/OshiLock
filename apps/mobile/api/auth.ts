import { apiClient } from './client';
import type { UserId } from '@oshilock/shared';

type SignInResponse = {
  userId: UserId;
  isNewUser: boolean;
};

export const authApi = {
  signIn(idToken: string): Promise<SignInResponse> {
    return apiClient.post<SignInResponse>('/auth/signin', { idToken });
  },
};
