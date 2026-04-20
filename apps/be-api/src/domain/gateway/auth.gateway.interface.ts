import type { AuthProvider } from '@oshilock/shared';

export type VerifiedToken = {
  uid: string;
  userId: string | null;
  authProvider: AuthProvider;
  authSub: string;
  email: string | null;
  name: string | null;
};

export interface IAuthGateway {
  verifyIdToken(idToken: string): Promise<VerifiedToken>;
  setCustomClaims(firebaseUid: string, claims: { userId: string }): Promise<void>;
}
