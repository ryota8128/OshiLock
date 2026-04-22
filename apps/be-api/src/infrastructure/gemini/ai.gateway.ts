import type { GoogleGenAI } from '@google/genai';
import { AiGatewayException } from '../../domain/errors/ai-gateway.exception.js';
import type { AiParseResult } from '../../domain/value-objects/parse-result-json.js';
import {
  ACTIVE_PARSE_RESULT_VERSION,
  parseResultZodSchema,
} from '../../domain/value-objects/parse-result-json.js';
import type { AiParseInput, IAiGateway } from '../../domain/gateway/ai.gateway.interface.js';
import { buildParsePrompt } from './prompts/parse.prompt.js';
import { parseResponseSchema } from './schemas/parse.schema.js';

export class GeminiAiGateway implements IAiGateway {
  static readonly model = 'gemini-2.0-flash';
  static readonly maxRetries = 1;
  static readonly activeParseResultVersion = ACTIVE_PARSE_RESULT_VERSION;
  static readonly parseResponseSchema = parseResponseSchema;

  constructor(private readonly client: GoogleGenAI) {}

  async parse(input: AiParseInput): Promise<AiParseResult> {
    const prompt = buildParsePrompt(input);
    return this.generateWithValidation(prompt);
  }

  private async generateWithValidation(prompt: string): Promise<AiParseResult> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= GeminiAiGateway.maxRetries; attempt++) {
      const responseText = await this.generate(prompt);
      const parseResult = parseResultZodSchema.safeParse({
        version: ACTIVE_PARSE_RESULT_VERSION,
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

  private async generate(prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: GeminiAiGateway.model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: parseResponseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new AiGatewayException('AI からの応答が空です');
    }

    return text;
  }
}
