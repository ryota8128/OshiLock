import { AUTH_PROVIDER, type AuthProvider } from '@oshilock/shared';
import type { IAuthGateway, VerifiedToken } from '../../domain/gateway/auth.gateway.interface.js';
import { firebaseAuth } from './client.js';

export class FirebaseAuthGateway implements IAuthGateway {
  async setCustomClaims(firebaseUid: string, claims: { userId: string }): Promise<void> {
    await firebaseAuth.setCustomUserClaims(firebaseUid, claims);
  }

  async verifyIdToken(idToken: string): Promise<VerifiedToken> {
    const decoded = await firebaseAuth.verifyIdToken(idToken);

    return {
      uid: decoded.uid,
      userId: (decoded.userId as string) ?? null,
      authProvider: resolveAuthProvider(decoded.firebase.sign_in_provider),
      authSub: decoded.sub,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
    };
  }
}

function resolveAuthProvider(signInProvider: string): AuthProvider {
  if (signInProvider === 'apple.com') return AUTH_PROVIDER.APPLE;
  if (signInProvider === 'google.com') return AUTH_PROVIDER.GOOGLE;
  throw new Error(`Unsupported sign in provider: ${signInProvider}`);
}
