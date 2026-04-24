import type { MiddlewareHandler } from 'hono';
import type { z, ZodSchema } from 'zod';
import { ValidationException } from '../../domain/errors/validation.exception.js';

type ValidateOptions<
  Q extends ZodSchema | undefined,
  B extends ZodSchema | undefined,
  P extends ZodSchema | undefined,
> = {
  query?: Q;
  body?: B;
  param?: P;
};

type InferSchema<T extends ZodSchema | undefined> = T extends ZodSchema ? z.infer<T> : {};

export function validate<
  Q extends ZodSchema | undefined = undefined,
  B extends ZodSchema | undefined = undefined,
  P extends ZodSchema | undefined = undefined,
>(
  opts: ValidateOptions<Q, B, P>,
): MiddlewareHandler<{
  Variables: { validated: InferSchema<Q> & InferSchema<B> & InferSchema<P> };
}> {
  return async (c, next) => {
    let queryResult = {} as InferSchema<Q>;
    let bodyResult = {} as InferSchema<B>;
    let paramResult = {} as InferSchema<P>;

    if (opts.query) {
      const parsed = opts.query.safeParse(c.req.query());
      if (!parsed.success) throw new ValidationException(parsed.error);
      queryResult = parsed.data;
    }

    if (opts.body) {
      const json = await c.req.json().catch(() => ({}));
      const parsed = opts.body.safeParse(json);
      if (!parsed.success) throw new ValidationException(parsed.error);
      bodyResult = parsed.data;
    }

    if (opts.param) {
      const parsed = opts.param.safeParse(c.req.param());
      if (!parsed.success) throw new ValidationException(parsed.error);
      paramResult = parsed.data;
    }

    c.set('validated', { ...queryResult, ...bodyResult, ...paramResult });
    await next();
  };
}
