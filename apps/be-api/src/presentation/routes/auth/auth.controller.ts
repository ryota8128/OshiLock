import { Hono } from 'hono';
import type { SignInResponse } from '@oshilock/shared';
import { signInUseCase } from '../../../composition/dependencies.js';
import { validate } from '../../middleware/validate.js';
import { signInRequestSchema } from './auth-request.schema.js';

const auth = new Hono();

auth.post('/signin', validate({ body: signInRequestSchema }), async (c) => {
  const { idToken } = c.get('validated');
  const result = await signInUseCase.execute(idToken);
  const response: SignInResponse = result;
  return c.json(response);
});

export { auth };
