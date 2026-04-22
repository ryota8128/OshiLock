import type { Timezone, EventInfo } from '@oshilock/shared';
import type { AiParseResult } from '../value-objects/parse-result-json.js';
import type { AiDuplicateResult } from '../value-objects/ai-duplicate-result.js';
import type { AiMergeResult } from '../value-objects/ai-merge-result.js';

export type AiParseInput = {
  postBody: string;
  sourceTexts: string[];
  timezone: Timezone;
};

export type AiDuplicateInput = {
  parseResult: AiParseResult;
  filteredToon: string;
};

export type AiMergeInput = {
  existingEventInfo: EventInfo;
  parseResult: AiParseResult;
};

export interface IAiGateway {
  parse(input: AiParseInput): Promise<AiParseResult>;
  checkDuplicate(input: AiDuplicateInput): Promise<AiDuplicateResult>;
  merge(input: AiMergeInput): Promise<AiMergeResult>;
}
