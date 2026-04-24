import { Hono } from 'hono';
import { z } from 'zod';
import { OshiId, type GetEventInfoListResponse } from '@oshilock/shared';
import { getEventInfoListUseCase } from '../../../composition/dependencies.js';
import { validate } from '../../middleware/validate.js';
import type { AuthEnv } from '../../middleware/auth.js';

const getEventInfoListQuerySchema = z.object({
  oshiId: OshiId.schema,
  limit: z.coerce.number().int().min(1).max(100).default(30),
  cursor: z.string().optional().nullable(),
});

const eventInfo = new Hono<AuthEnv>();

eventInfo.get('/', validate({ query: getEventInfoListQuerySchema }), async (c) => {
  const { oshiId, limit, cursor } = c.get('validated');

  const result = await getEventInfoListUseCase.execute(oshiId, { limit, cursor });

  const response: GetEventInfoListResponse = result;
  return c.json(response);
});

export { eventInfo };
