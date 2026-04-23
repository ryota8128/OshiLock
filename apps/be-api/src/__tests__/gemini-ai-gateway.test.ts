import { describe, it, expect, vi } from 'vitest';
import { GeminiAiGateway } from '../infrastructure/gemini/ai.gateway.js';
import type { GoogleGenAI } from '@google/genai';

const PARSE_INPUT = {
  oshiName: 'UVERworld',
  postBody: 'テスト',
  sourceTexts: [] as string[],
  timezone: { iana: 'Asia/Tokyo', offset: 9 } as const,
};

function createMockClient(responseText: string) {
  return {
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: responseText,
      }),
    },
  } as unknown as GoogleGenAI;
}

describe('GeminiAiGateway', () => {
  describe('parse', () => {
    it('パース結果を構造化して返す', async () => {
      const mockResponse = JSON.stringify({
        isRelevant: true,
        title: '夏フェス2026',
        category: 'EVENT',
        startDate: '2026-07-20',
        startTime: '14:00',
        endDate: null,
        endTime: null,
        summary: '夏フェス 東京ガーデンシアター 7/20開催',
        detail: '夏フェス2026が東京ガーデンシアターで7/20に開催。',
      });

      const client = createMockClient(mockResponse);
      const gateway = new GeminiAiGateway(client);

      const result = await gateway.parse({
        ...PARSE_INPUT,
        postBody: '夏フェス2026やるって！7/20 東京ガーデンシアター',
      });

      expect(result).not.toBeNull();
      expect(result!.title).toBe('夏フェス2026');
      expect(result!.category).toBe('EVENT');
      expect(result!.startDate).toBe('2026-07-20');
      expect(result!.startTime).toBe('14:00');
      expect(result!.endDate).toBeNull();
      expect(result!.summary).toBe('夏フェス 東京ガーデンシアター 7/20開催');
    });

    it('isRelevant: false なら null を返す', async () => {
      const mockResponse = JSON.stringify({
        isRelevant: false,
        title: '',
        category: 'NEWS',
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        summary: '',
        detail: '',
      });

      const client = createMockClient(mockResponse);
      const gateway = new GeminiAiGateway(client);

      const result = await gateway.parse({
        ...PARSE_INPUT,
        postBody: '今日のランチ美味しかった',
      });

      expect(result).toBeNull();
    });

    it('AI レスポンスをそのまま返す（同日正規化はしない）', async () => {
      const mockResponse = JSON.stringify({
        isRelevant: true,
        title: 'ライブ',
        category: 'EVENT',
        startDate: '2026-07-20',
        startTime: '18:00',
        endDate: '2026-07-20',
        endTime: '21:00',
        summary: 'ライブ 7/20',
        detail: 'ライブ 7/20開催',
      });

      const client = createMockClient(mockResponse);
      const gateway = new GeminiAiGateway(client);

      const result = await gateway.parse({
        ...PARSE_INPUT,
        postBody: 'ライブ 7/20',
      });

      expect(result!.endDate).toBe('2026-07-20');
      expect(result!.endTime).toBe('21:00');
    });

    it('AI 応答が空ならエラー', async () => {
      const client = {
        models: {
          generateContent: vi.fn().mockResolvedValue({ text: '' }),
        },
      } as unknown as GoogleGenAI;

      const gateway = new GeminiAiGateway(client);

      await expect(gateway.parse(PARSE_INPUT)).rejects.toThrow('AI からの応答が空です');
    });
  });
});
