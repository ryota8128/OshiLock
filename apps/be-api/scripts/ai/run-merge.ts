/**
 * AI マージの手動テスト
 * 使い方: npx tsx --env-file=.env scripts/ai/run-merge.ts scripts/ai/inputs/merge/basic-01.json
 */
import { readFileSync } from 'node:fs';
import { GoogleGenAI } from '@google/genai';
import { GeminiAiGateway } from '../../src/infrastructure/gemini/ai.gateway.js';
import { saveResult } from './utils.js';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: npx tsx --env-file=.env scripts/ai/run-merge.ts <input.json>');
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'dummy') {
  console.error('GEMINI_API_KEY を .env に設定してください');
  process.exit(1);
}

const input = JSON.parse(readFileSync(inputPath, 'utf-8')) as {
  existingEventInfo: any;
  parseResult: any;
};

const client = new GoogleGenAI({ apiKey });
const gateway = new GeminiAiGateway(client);

async function main() {
  console.log('=== AI merge ===');
  const result = await gateway.merge({
    existingEventInfo: input.existingEventInfo,
    parseResult: input.parseResult,
  });
  console.log(JSON.stringify(result, null, 2));

  saveResult(inputPath, input, result, GeminiAiGateway.model);
}

main().catch(console.error);
