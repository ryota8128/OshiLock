import { Hono } from 'hono';
import { z } from 'zod';
import {
  OshiId,
  EventId,
  type GetEventInfoListResponse,
  type GetEventInfoResponse,
} from '@oshilock/shared';
import { getEventInfoListUseCase, getEventInfoUseCase } from '../../../composition/dependencies.js';
import { validate } from '../../middleware/validate.js';
import type { AuthEnv } from '../../middleware/auth.js';

const getEventInfoListParamSchema = z.object({
  oshiId: OshiId.schema,
});

const getEventInfoListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(30),
  cursor: z.string().optional().nullable(),
});

const getEventInfoParamSchema = z.object({
  oshiId: OshiId.schema,
  eventId: EventId.schema,
});

const eventInfo = new Hono<AuthEnv>();

eventInfo.get(
  '/:oshiId',
  validate({ param: getEventInfoListParamSchema, query: getEventInfoListQuerySchema }),
  async (c) => {
    const { oshiId, limit, cursor } = c.get('validated');

    const result = await getEventInfoListUseCase.execute(oshiId, { limit, cursor });

    const response: GetEventInfoListResponse = result;
    return c.json(response);
  },
);

eventInfo.get('/:oshiId/:eventId', validate({ param: getEventInfoParamSchema }), async (c) => {
  const { oshiId, eventId } = c.get('validated');

  const result = await getEventInfoUseCase.execute(oshiId, eventId);

  const response: GetEventInfoResponse = { eventInfo: result };
  return c.json(response);
});

export { eventInfo };
