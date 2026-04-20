import { apiClient } from './client';
import type { SignInResponse } from '@oshilock/shared';

export const authApi = {
  signIn(idToken: string): Promise<SignInResponse> {
    return apiClient.post<SignInResponse>('/auth/signin', { idToken });
  },
};
