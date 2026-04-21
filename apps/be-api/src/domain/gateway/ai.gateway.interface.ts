import type { Timezone } from '@oshilock/shared';
import type { AiParseResult } from './ai-parse-result.js';

export type AiParseInput = {
  postBody: string;
  sourceTexts: string[];
  timezone: Timezone;
};

export interface IAiGateway {
  parse(input: AiParseInput): Promise<AiParseResult>;
}
