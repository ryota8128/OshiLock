import { z } from 'zod';
import { MATCH_TYPE, EventId } from '@oshilock/shared';

export const duplicateResultZodSchema = z.object({
  matchType: z.nativeEnum(MATCH_TYPE),
  matchedEventId: EventId.schema.nullable(),
});

export type AiDuplicateResult = z.output<typeof duplicateResultZodSchema>;
