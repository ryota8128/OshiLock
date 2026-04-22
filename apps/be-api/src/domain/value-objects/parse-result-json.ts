import { z } from 'zod';
import { OshiLockBeException } from '../errors/oshilock-be.exception.js';
import { aiEventBaseSchema } from './ai-event-schema.js';

export const ACTIVE_PARSE_RESULT_VERSION = 1 as const;

const schemas = {
  1: aiEventBaseSchema.extend({ version: z.literal(1) }),
} as const;

export const parseResultZodSchema = schemas[ACTIVE_PARSE_RESULT_VERSION];

export type AiParseResult = z.output<typeof parseResultZodSchema>;

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
      return getParseResultSchema(version).parse(raw);
    } catch (e) {
      console.error(`パース結果の復元に失敗しました（version: ${version}）${json}`);
      throw new OshiLockBeException(500, `パース結果の復元に失敗しました（version: ${version}）`);
    }
  }

  export function stringify(result: AiParseResult): string {
    return JSON.stringify(result);
  }
}
