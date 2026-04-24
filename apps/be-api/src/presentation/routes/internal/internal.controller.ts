import { Hono } from 'hono';
import { PostId } from '@oshilock/shared';
import { z } from 'zod';
import { processPostUseCase } from '../../../composition/dependencies.js';
import { validate } from '../../middleware/validate.js';

const processPostRequestSchema = z.object({
  postId: PostId.schema,
});

const internal = new Hono();

internal.post('/process-post', validate({ body: processPostRequestSchema }), async (c) => {
  const { postId } = c.get('validated');

  await processPostUseCase.execute(postId);

  return c.json({ status: 'ok' });
});

export { internal };
