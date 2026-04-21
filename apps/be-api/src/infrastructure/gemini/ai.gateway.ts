import type { GoogleGenAI, Schema } from '@google/genai';
import type { z, ZodSchema, ZodType } from 'zod';
import type { AiParseResult } from '../../domain/gateway/ai-parse-result.js';
import { parseResultZodSchema } from '../../domain/gateway/ai-parse-result.js';
import type { IAiGateway, AiParseInput } from '../../domain/gateway/ai.gateway.interface.js';
import { AiGatewayException } from '../../domain/errors/ai-gateway.exception.js';
import { buildParsePrompt } from './prompts/parse.prompt.js';
import { parseResponseSchema } from './schemas/parse.schema.js';

const MODEL = 'gemini-2.0-flash';
const MAX_RETRIES = 1;

export class GeminiAiGateway implements IAiGateway {
  constructor(private readonly client: GoogleGenAI) {}

  async parse(input: AiParseInput): Promise<AiParseResult> {
    const prompt = buildParsePrompt(input);
    return this.generateWithValidation(prompt, parseResponseSchema, parseResultZodSchema);
  }

  private async generateWithValidation<T>(
    prompt: string,
    responseSchema: Schema,
    zodSchema: z.ZodType<T, z.ZodTypeDef, unknown>,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const responseText = await this.generate(prompt, responseSchema);
      const parseResult = zodSchema.safeParse(JSON.parse(responseText));

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
      model: MODEL,
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
