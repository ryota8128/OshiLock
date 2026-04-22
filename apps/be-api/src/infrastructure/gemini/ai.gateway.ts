import type { GoogleGenAI, Schema } from '@google/genai';
import type { ZodType } from 'zod';
import { AiGatewayException } from '../../domain/errors/ai-gateway.exception.js';
import type { AiParseResult } from '../../domain/value-objects/parse-result-json.js';
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
import { eventBaseResponseSchema } from './schemas/event-base.schema.js';
import { duplicateCheckResponseSchema } from './schemas/duplicate-check.schema.js';

export class GeminiAiGateway implements IAiGateway {
  static readonly model = 'gemini-2.5-flash-lite';
  static readonly maxRetries = 1;
  static readonly activeParseResultVersion = ACTIVE_PARSE_RESULT_VERSION;
  static readonly eventBaseSchema = eventBaseResponseSchema;
  static readonly duplicateCheckSchema = duplicateCheckResponseSchema;

  constructor(private readonly client: GoogleGenAI) {}

  async parse(input: AiParseInput): Promise<AiParseResult> {
    const prompt = buildParsePrompt(input);
    return this.generateWithValidation(
      prompt,
      GeminiAiGateway.eventBaseSchema,
      parseResultZodSchema,
      {
        version: GeminiAiGateway.activeParseResultVersion,
      },
    );
  }

  async checkDuplicate(input: AiDuplicateInput): Promise<AiDuplicateResult> {
    const prompt = buildDuplicateCheckPrompt(input);
    return this.generateWithValidation(
      prompt,
      GeminiAiGateway.duplicateCheckSchema,
      duplicateResultZodSchema,
    );
  }

  async merge(input: AiMergeInput): Promise<AiMergeResult> {
    const prompt = buildMergePrompt(input);
    return this.generateWithValidation(
      prompt,
      GeminiAiGateway.eventBaseSchema,
      mergeResultZodSchema,
    );
  }

  private async generateWithValidation<T>(
    prompt: string,
    responseSchema: Schema,
    zodSchema: ZodType<T, any, any>,
    extraFields?: Record<string, unknown>,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= GeminiAiGateway.maxRetries; attempt++) {
      const responseText = await this.generate(prompt, responseSchema);
      const parseResult = zodSchema.safeParse({
        ...extraFields,
        ...JSON.parse(responseText),
      });

      if (parseResult.success) {
        return parseResult.data;
      }

      lastError = parseResult.error;
    }

    throw new AiGatewayException(
      `AI レスポンスの検証に失敗しました: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    );
  }

  private async generate(prompt: string, responseSchema: Schema): Promise<string> {
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

    return text;
  }
}
