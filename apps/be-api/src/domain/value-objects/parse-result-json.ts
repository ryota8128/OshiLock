import { z } from 'zod';
import { OshiLockBeException } from '../errors/oshilock-be.exception.js';
import { aiEventBaseSchema } from './ai-event-schema.js';

export const ACTIVE_PARSE_RESULT_VERSION = 1 as const;

const relevantSchema = z.object({
  isRelevant: z.literal(true),
  version: z.literal(1),
  ...aiEventBaseSchema.shape,
});

const irrelevantSchema = z.object({
  isRelevant: z.literal(false),
});

const schemas = {
  1: z.discriminatedUnion('isRelevant', [relevantSchema, irrelevantSchema]),
} as const;

export const parseResultZodSchema = schemas[ACTIVE_PARSE_RESULT_VERSION];

export type AiParseResult = z.output<typeof relevantSchema>;
export type AiParseOutput = z.output<typeof parseResultZodSchema>;

export function getParseResultSchema(version: number) {
  const schema = schemas[version as keyof typeof schemas];
  if (!schema) throw new Error(`Unknown parse result version: ${version}`);
  return schema;
}

export namespace ParseResultJson {
  export function parse(json: string): AiParseResult {
    const raw = JSON.parse(json) as { version?: number };
    const version = raw.version ?? ACTIVE_PARSE_RESULT_VERSION;
    try {
      const result = getParseResultSchema(version).parse(raw);
      if (!result.isRelevant) {
        throw new OshiLockBeException(500, 'パース結果が irrelevant ですが復元が要求されました');
      }
      return result;
    } catch (e) {
      if (e instanceof OshiLockBeException) throw e;
      console.error(`パース結果の復元に失敗しました（version: ${version}）${json}`);
      throw new OshiLockBeException(500, `パース結果の復元に失敗しました（version: ${version}）`);
    }
  }

  export function stringify(result: AiParseResult): string {
    return JSON.stringify(result);
  }
}
