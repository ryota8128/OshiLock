import type { GoogleGenAI, Schema } from '@google/genai';
import type { ZodType } from 'zod';
import { withRetry } from '@oshilock/shared';
import { AiGatewayException } from '../../domain/errors/ai-gateway.exception.js';
import type { AiParseResult, AiParseOutput } from '../../domain/value-objects/parse-result-json.js';
import {
  ACTIVE_PARSE_RESULT_VERSION,
  parseResultZodSchema,
} from '../../domain/value-objects/parse-result-json.js';
import type { AiDuplicateResult } from '../../domain/value-objects/ai-duplicate-result.js';
import { duplicateResultZodSchema } from '../../domain/value-objects/ai-duplicate-result.js';
import type { AiMergeResult } from '../../domain/value-objects/ai-merge-result.js';
import { mergeResultZodSchema } from '../../domain/value-objects/ai-merge-result.js';
import type {
  AiParseInput,
  AiDuplicateInput,
  AiMergeInput,
  IAiGateway,
} from '../../domain/gateway/ai.gateway.interface.js';
import { buildParsePrompt } from './prompts/parse.prompt.js';
import { buildDuplicateCheckPrompt } from './prompts/duplicate-check.prompt.js';
import { buildMergePrompt } from './prompts/merge.prompt.js';
import { parseResponseSchema } from './schemas/parse.schema.js';
import { eventBaseResponseSchema } from './schemas/event-base.schema.js';
import { duplicateCheckResponseSchema } from './schemas/duplicate-check.schema.js';

export class GeminiAiGateway implements IAiGateway {
  static readonly model = 'gemini-2.5-flash-lite';
  static readonly maxRetries = 1;

  constructor(private readonly client: GoogleGenAI) {}

  async parse(input: AiParseInput): Promise<AiParseResult | null> {
    const prompt = buildParsePrompt(input);
    const result: AiParseOutput = await this.generateAndValidate(
      prompt,
      parseResponseSchema,
      parseResultZodSchema,
      { version: ACTIVE_PARSE_RESULT_VERSION },
    );

    return result.isRelevant ? result : null;
  }

  async checkDuplicate(input: AiDuplicateInput): Promise<AiDuplicateResult> {
    const prompt = buildDuplicateCheckPrompt(input);
    return this.generateAndValidate(prompt, duplicateCheckResponseSchema, duplicateResultZodSchema);
  }

  async merge(input: AiMergeInput): Promise<AiMergeResult> {
    const prompt = buildMergePrompt(input);
    return this.generateAndValidate(prompt, eventBaseResponseSchema, mergeResultZodSchema);
  }

  private async generateAndValidate<T>(
    prompt: string,
    responseSchema: Schema,
    zodSchema: ZodType<T, any, any>,
    extraFields?: Record<string, unknown>,
  ): Promise<T> {
    return withRetry(
      async () => {
        const raw = await this.generateJson(prompt, responseSchema);
        const result = zodSchema.safeParse({ ...extraFields, ...raw });
        if (!result.success) throw result.error;

        return result.data;
      },
      { maxRetries: GeminiAiGateway.maxRetries },
    );
  }

  private async generateJson(
    prompt: string,
    responseSchema: Schema,
  ): Promise<Record<string, unknown>> {
    const response = await this.client.models.generateContent({
      model: GeminiAiGateway.model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new AiGatewayException('AI からの応答が空です');
    }

    return JSON.parse(text) as Record<string, unknown>;
  }
}
