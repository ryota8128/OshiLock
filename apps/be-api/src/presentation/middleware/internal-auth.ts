import type { MiddlewareHandler } from 'hono';
import { env } from '../../config/env.js';
import { UnauthorizedException } from '../../domain/errors/unauthorized.exception.js';

export const internalAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const apiKey = c.req.header('x-api-key');

  if (apiKey !== env.INTERNAL_API_KEY) {
    throw new UnauthorizedException('無効な API キーです');
  }

  await next();
};
