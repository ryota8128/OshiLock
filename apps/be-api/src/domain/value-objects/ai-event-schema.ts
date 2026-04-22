import { z } from 'zod';
import { EVENT_CATEGORY, DateString, TimeString } from '@oshilock/shared';

/** AI parse / merge 共通のイベント情報スキーマ */
export const aiEventBaseSchema = z.object({
  title: z.string(),
  category: z.nativeEnum(EVENT_CATEGORY),
  startDate: DateString.schema,
  startTime: TimeString.schema.nullable(),
  endDate: DateString.schema.nullable(),
  endTime: TimeString.schema.nullable(),
  summary: z.string(),
  detail: z.string(),
});

export type AiEventBase = z.output<typeof aiEventBaseSchema>;
