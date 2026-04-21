import type { AiParseResult } from './ai-parse-result.js';

export type AiParseInput = {
  postBody: string;
  sourceTexts: string[];
  currentDate: string;
  currentTime: string;
};

export interface IAiGateway {
  parse(input: AiParseInput): Promise<AiParseResult>;
}
