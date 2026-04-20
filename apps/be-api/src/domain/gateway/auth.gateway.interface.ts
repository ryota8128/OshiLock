import type { AuthProvider } from '@oshilock/shared';

export type VerifiedToken = {
  uid: string;
  authProvider: AuthProvider;
  authSub: string;
  email: string | null;
  name: string | null;
};

export interface IAuthGateway {
  verifyIdToken(idToken: string): Promise<VerifiedToken>;
}
