import { UserId } from '@oshilock/shared';
import type { MiddlewareHandler } from 'hono';
import { UnauthorizedException } from '../../domain/errors/unauthorized.exception.js';
import { firebaseAuth } from '../../infrastructure/firebase/client.js';

export type AuthContext = {
  firebaseUid: string;
  userId: UserId;
};

export type AuthEnv = {
  Variables: {
    auth: AuthContext;
  };
};

export const authMiddleware: MiddlewareHandler<AuthEnv> = async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedException('Authorization ヘッダーが必要です');
  }

  const token = header.slice(7);

  const decoded = await firebaseAuth.verifyIdToken(token).catch(() => {
    throw new UnauthorizedException('無効なトークンです');
  });

  const userId = decoded.userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedException('ユーザー登録が完了していません。再度ログインしてください。');
  }

  const parsedUserId = UserId.schema.safeParse(userId);
  if (!parsedUserId.success) {
    throw new UnauthorizedException('無効なユーザーIDです');
  }

  c.set('auth', {
    firebaseUid: decoded.uid,
    userId: parsedUserId.data,
  });

  await next();
};
