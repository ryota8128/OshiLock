import { Hono } from 'hono';
import type { AuthEnv } from '../../middleware/auth.js';
import { type CreatePostResponse, createPostRequestSchema } from '@oshilock/shared';
import { createPostUseCase } from '../../../composition/dependencies.js';
import { validate } from '../../middleware/validate.js';

const post = new Hono<AuthEnv>();

post.post('/', validate({ body: createPostRequestSchema }), async (c) => {
  const { userId } = c.get('auth');
  const { oshiId, body, sourceUrls } = c.get('validated');

  const result = await createPostUseCase.execute({
    userId,
    oshiId,
    body,
    sourceUrls,
  });

  const response: CreatePostResponse = { post: result };
  return c.json(response, 201);
});

export { post };
