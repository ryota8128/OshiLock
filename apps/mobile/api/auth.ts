import { apiClient } from './client';
import type { SignInRequest, SignInResponse } from '@oshilock/shared';

export const authApi = {
  signIn(idToken: string): Promise<SignInResponse> {
    const body: SignInRequest = { idToken };
    return apiClient.post<SignInResponse>('/auth/signin', body);
  },
};
