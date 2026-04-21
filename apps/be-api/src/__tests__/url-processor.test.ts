import { describe, it, expect, beforeAll } from 'vitest';
import { UrlProcessor } from '../application/services/url-processor.js';

let processor: UrlProcessor;

beforeAll(() => {
  processor = new UrlProcessor();
});

describe('extractUrls', () => {
  it('本文中の URL を抽出する', () => {
    const body = 'ライブ情報 https://example.com/live 詳細はこちら';
    const result = processor.extractUrls(body, []);
    expect(result).toEqual(['https://example.com/live']);
  });

  it('sourceUrls と本文の URL を合わせて重複除去する', () => {
    const body = 'チェック https://example.com/a';
    const sourceUrls = ['https://example.com/a', 'https://example.com/b'];
    const result = processor.extractUrls(body, sourceUrls);
    expect(result).toEqual(['https://example.com/a', 'https://example.com/b']);
  });

  it('最大3件に制限する', () => {
    const sourceUrls = ['https://a.com', 'https://b.com', 'https://c.com', 'https://d.com'];
    const result = processor.extractUrls('', sourceUrls);
    expect(result).toHaveLength(3);
  });
});

describe('normalizeUrl', () => {
  it('http を https に変換', () => {
    expect(processor.normalizeUrl('http://example.com/page')).toBe('https://example.com/page');
  });

  it('www. を除去', () => {
    expect(processor.normalizeUrl('https://www.example.com/page')).toBe('https://example.com/page');
  });

  it('末尾スラッシュを除去', () => {
    expect(processor.normalizeUrl('https://example.com/page/')).toBe('https://example.com/page');
  });

  it('トラッキングパラメータを除去', () => {
    expect(processor.normalizeUrl('https://example.com/page?utm_source=twitter&id=123')).toBe(
      'https://example.com/page?id=123',
    );
  });

  it('フラグメントを除去', () => {
    expect(processor.normalizeUrl('https://example.com/page#section')).toBe(
      'https://example.com/page',
    );
  });

  it('意味のあるクエリパラメータは保持', () => {
    expect(processor.normalizeUrl('https://example.com/page?id=123&tab=info')).toBe(
      'https://example.com/page?id=123&tab=info',
    );
  });
});
