/**
 * AI パースの手動テスト
 * 使い方: npx tsx --env-file=.env scripts/ai/run-parse.ts scripts/ai/inputs/parse/basic-01.json
 */
import { readFileSync } from 'node:fs';
import { GoogleGenAI } from '@google/genai';
import { GeminiAiGateway } from '../../src/infrastructure/gemini/ai.gateway.js';
import { UrlProcessor } from '../../src/application/services/post/url-processor.js';
import { TIMEZONES } from '@oshilock/shared';
import { saveResult } from './utils.js';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: npx tsx --env-file=.env scripts/ai/run-parse.ts <input.json>');
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'dummy') {
  console.error('GEMINI_API_KEY を .env に設定してください');
  process.exit(1);
}

const input = JSON.parse(readFileSync(inputPath, 'utf-8')) as {
  postBody: string;
  sourceUrls: string[];
};

const client = new GoogleGenAI({ apiKey });
const gateway = new GeminiAiGateway(client);
const urlProcessor = new UrlProcessor();

async function main() {
  console.log('=== URL fetch ===');
  const urls = urlProcessor.extractUrls(input.postBody, input.sourceUrls);
  const sourceTexts: string[] = [];
  for (const url of urls) {
    console.log(`Fetching: ${url}`);
    const text = await urlProcessor.fetchUrlText(url);
    if (text) {
      sourceTexts.push(text);
      console.log(`  → ${text.length} 文字取得`);
    } else {
      console.log('  → 取得失敗');
    }
  }

  console.log('\n=== AI parse ===');
  const parseInput = {
    postBody: input.postBody,
    sourceTexts,
    timezone: TIMEZONES.ASIA_TOKYO,
  };
  const result = await gateway.parse(parseInput);
  console.log(JSON.stringify(result, null, 2));

  saveResult(inputPath, { ...input, sourceTexts }, result, GeminiAiGateway.model);
}

main().catch(console.error);
