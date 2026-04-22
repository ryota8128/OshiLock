import { z } from 'zod';
import { EVENT_CATEGORY, DateString, TimeString } from '@oshilock/shared';

export const ACTIVE_PARSE_RESULT_VERSION = 1 as const;

const schemas = {
  1: z.object({
    version: z.literal(1),
    title: z.string(),
    category: z.nativeEnum(EVENT_CATEGORY),
    startDate: DateString.schema.nullable(),
    startTime: TimeString.schema.nullable(),
    endDate: DateString.schema.nullable(),
    endTime: TimeString.schema.nullable(),
    summary: z.string(),
    detail: z.string(),
  }),
} as const;

export const parseResultZodSchema = schemas[ACTIVE_PARSE_RESULT_VERSION];

export type AiParseResult = z.output<typeof parseResultZodSchema>;

export function getParseResultSchema(version: number) {
  const schema = schemas[version as keyof typeof schemas];
  if (!schema) throw new Error(`Unknown parse result version: ${version}`);
  return schema;
}
