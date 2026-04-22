import { z } from 'zod';
import { EVENT_CATEGORY, DateString, TimeString } from '@oshilock/shared';

export const parseResultZodSchema = z.object({
  title: z.string(),
  category: z.nativeEnum(EVENT_CATEGORY),
  startDate: DateString.schema.nullable(),
  startTime: TimeString.schema.nullable(),
  endDate: DateString.schema.nullable(),
  endTime: TimeString.schema.nullable(),
  summary: z.string(),
  detail: z.string(),
});

export type AiParseResult = z.output<typeof parseResultZodSchema>;
