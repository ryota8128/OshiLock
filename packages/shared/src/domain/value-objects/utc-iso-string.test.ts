import { describe, expect, it } from 'vitest';
import { TIMEZONES } from '../../const/timezone';
import { UtcIsoString } from './utc-iso-string';

describe('UtcIsoString', () => {
  describe('parse', () => {
    it('UTC形式(Z)を受け付ける', () => {
      const result = UtcIsoString.parse('2026-04-18T09:00:00Z');
      expect(result).toBe('2026-04-18T09:00:00Z');
    });

    it('ミリ秒付きUTCを受け付ける', () => {
      const result = UtcIsoString.parse('2026-04-18T09:00:00.000Z');
      expect(result).toBe('2026-04-18T09:00:00.000Z');
    });

    it('オフセット付き(+09:00)を弾く', () => {
      expect(() => UtcIsoString.parse('2026-04-18T18:00:00+09:00')).toThrow();
    });

    it('不正な文字列を弾く', () => {
      expect(() => UtcIsoString.parse('not-a-date')).toThrow();
    });

    it('空文字を弾く', () => {
      expect(() => UtcIsoString.parse('')).toThrow();
    });
  });

  describe('afterMs', () => {
    it('指定ミリ秒後のUTC ISO文字列を返す', () => {
      const before = Date.now();
      const result = UtcIsoString.afterMs(60_000);
      const after = Date.now();

      const resultTime = new Date(result).getTime();
      expect(resultTime).toBeGreaterThanOrEqual(before + 60_000);
      expect(resultTime).toBeLessThanOrEqual(after + 60_000);
    });

    it('0ミリ秒で現在時刻を返す', () => {
      const before = Date.now();
      const result = UtcIsoString.afterMs(0);
      const after = Date.now();

      const resultTime = new Date(result).getTime();
      expect(resultTime).toBeGreaterThanOrEqual(before);
      expect(resultTime).toBeLessThanOrEqual(after);
    });

    it('返り値がUTC ISO形式である', () => {
      const result = UtcIsoString.afterMs(1000);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });
  });

  describe('toDateString', () => {
    it('UTCの日付をJSTの日付に変換する', () => {
      const utc = UtcIsoString.from('2026-04-18T15:00:00Z');
      const result = UtcIsoString.toDateString(utc, TIMEZONES.ASIA_TOKYO);
      expect(result).toBe('2026-04-19');
    });

    it('日付が変わらないケース', () => {
      const utc = UtcIsoString.from('2026-04-18T09:00:00Z');
      const result = UtcIsoString.toDateString(utc, TIMEZONES.ASIA_TOKYO);
      expect(result).toBe('2026-04-18');
    });
  });

  describe('toTimeString', () => {
    it('UTCの時刻をJSTの時刻に変換する', () => {
      const utc = UtcIsoString.from('2026-04-18T09:00:00Z');
      const result = UtcIsoString.toTimeString(utc, TIMEZONES.ASIA_TOKYO);
      expect(result).toBe('18:00');
    });

    it('日跨ぎの時刻変換', () => {
      const utc = UtcIsoString.from('2026-04-18T20:30:00Z');
      const result = UtcIsoString.toTimeString(utc, TIMEZONES.ASIA_TOKYO);
      expect(result).toBe('05:30');
    });
  });
});
