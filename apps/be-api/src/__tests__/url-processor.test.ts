import { describe, it, expect, beforeAll } from 'vitest';
import { UrlProcessor } from '../application/services/post/url-processor.js';

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

  it('URL を正規化して返す（http→https, www除去, トラッキングパラメータ除去）', () => {
    const result = processor.extractUrls('', [
      'http://www.example.com/page?utm_source=twitter&id=123',
    ]);
    expect(result).toEqual(['https://example.com/page?id=123']);
  });

  it('正規化後に重複する URL は1件にまとめる', () => {
    const result = processor.extractUrls('', [
      'https://example.com/page',
      'https://www.example.com/page/',
    ]);
    expect(result).toEqual(['https://example.com/page']);
  });

  it('フラグメントを除去する', () => {
    const result = processor.extractUrls('', ['https://example.com/page#section']);
    expect(result).toEqual(['https://example.com/page']);
  });
});
