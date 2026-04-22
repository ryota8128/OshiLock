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

  describe('addDays', () => {
    it('正の日数を加算する', () => {
      expect(DateString.addDays(DateString.from('2026-04-20'), 5)).toBe('2026-04-25');
    });

    it('負の日数で過去の日付を返す', () => {
      expect(DateString.addDays(DateString.from('2026-04-20'), -30)).toBe('2026-03-21');
    });

    it('月をまたぐ加算', () => {
      expect(DateString.addDays(DateString.from('2026-01-30'), 3)).toBe('2026-02-02');
    });

    it('年をまたぐ加算', () => {
      expect(DateString.addDays(DateString.from('2026-12-30'), 5)).toBe('2027-01-04');
    });

    it('0日で同じ日付を返す', () => {
      expect(DateString.addDays(DateString.from('2026-04-20'), 0)).toBe('2026-04-20');
    });
  });

  describe('isBefore', () => {
    it('前の日付ならtrue', () => {
      expect(
        DateString.isBefore(DateString.from('2026-04-19'), DateString.from('2026-04-20')),
      ).toBe(true);
    });

    it('同じ日付ならfalse', () => {
      expect(
        DateString.isBefore(DateString.from('2026-04-20'), DateString.from('2026-04-20')),
      ).toBe(false);
    });

    it('後の日付ならfalse', () => {
      expect(
        DateString.isBefore(DateString.from('2026-04-21'), DateString.from('2026-04-20')),
      ).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('後の日付ならtrue', () => {
      expect(DateString.isAfter(DateString.from('2026-04-21'), DateString.from('2026-04-20'))).toBe(
        true,
      );
    });

    it('同じ日付ならfalse', () => {
      expect(DateString.isAfter(DateString.from('2026-04-20'), DateString.from('2026-04-20'))).toBe(
        false,
      );
    });

    it('前の日付ならfalse', () => {
      expect(DateString.isAfter(DateString.from('2026-04-19'), DateString.from('2026-04-20'))).toBe(
        false,
      );
    });
  });
});
