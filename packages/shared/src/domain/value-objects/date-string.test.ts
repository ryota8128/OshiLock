import { describe, expect, it } from 'vitest';
import { DateString } from './date-string';

describe('DateString', () => {
  describe('parse', () => {
    it('YYYY-MM-DD形式を受け付ける', () => {
      const result = DateString.parse('2026-04-18');
      expect(result).toBe('2026-04-18');
    });

    it('月初を受け付ける', () => {
      const result = DateString.parse('2026-01-01');
      expect(result).toBe('2026-01-01');
    });

    it('スラッシュ区切りを弾く', () => {
      expect(() => DateString.parse('2026/04/18')).toThrow();
    });

    it('時刻付きを弾く', () => {
      expect(() => DateString.parse('2026-04-18T09:00:00Z')).toThrow();
    });

    it('不正な文字列を弾く', () => {
      expect(() => DateString.parse('not-a-date')).toThrow();
    });

    it('空文字を弾く', () => {
      expect(() => DateString.parse('')).toThrow();
    });
  });
});
