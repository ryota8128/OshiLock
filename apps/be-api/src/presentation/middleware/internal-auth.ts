import type { MiddlewareHandler } from 'hono';

// TODO: 内部 API 認証を実装する（GitHub Issue #5）
// 候補: API キー認証、VPC 内通信制限、IAM 署名検証 等
export const internalAuthMiddleware: MiddlewareHandler = async (_c, next) => {
  await next();
};
