import { describe, expect, it } from 'vitest';
import { DisplayName } from './display-name';

describe('DisplayName', () => {
  describe('schema', () => {
    it('2文字の名前を受け付ける（最小）', () => {
      const result = DisplayName.schema.parse('ab');
      expect(result).toBe('ab');
    });

    it('20文字の名前を受け付ける（最大）', () => {
      const name = 'a'.repeat(20);
      const result = DisplayName.schema.parse(name);
      expect(result).toBe(name);
    });

    it('通常の名前を受け付ける', () => {
      const result = DisplayName.schema.parse('テストユーザー');
      expect(result).toBe('テストユーザー');
    });

    it('1文字の名前を弾く', () => {
      expect(() => DisplayName.schema.parse('a')).toThrow();
    });

    it('21文字の名前を弾く', () => {
      expect(() => DisplayName.schema.parse('a'.repeat(21))).toThrow();
    });

    it('空文字を弾く', () => {
      expect(() => DisplayName.schema.parse('')).toThrow();
    });
  });
});
