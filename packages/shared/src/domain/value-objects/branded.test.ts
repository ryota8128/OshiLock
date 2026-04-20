import { describe, expect, it } from 'vitest';
import { UserId, EventId, CommentId, PostId, OshiId } from './branded';

describe('Branded IDs', () => {
  describe.each([
    { name: 'UserId', ns: UserId, prefix: 'u_' },
    { name: 'EventId', ns: EventId, prefix: 'e_' },
    { name: 'CommentId', ns: CommentId, prefix: 'c_' },
    { name: 'PostId', ns: PostId, prefix: 'p_' },
    { name: 'OshiId', ns: OshiId, prefix: 'o_' },
  ])('$name', ({ ns, prefix }) => {
    describe('from', () => {
      it('任意の文字列をブランド型として返す', () => {
        const value = `${prefix}abc123`;
        const result = ns.from(value);
        expect(result).toBe(value);
      });
    });

    describe('generate', () => {
      it('プレフィックス付きのIDを生成する', () => {
        const result = ns.generate();
        expect(result).toMatch(new RegExp(`^${prefix.replace('_', '_')}`));
      });

      it('毎回異なるIDを生成する', () => {
        const id1 = ns.generate();
        const id2 = ns.generate();
        expect(id1).not.toBe(id2);
      });
    });

    describe('schema', () => {
      it('正しいプレフィックスの文字列をパースできる', () => {
        const value = `${prefix}test123`;
        const result = ns.schema.parse(value);
        expect(result).toBe(value);
      });

      it('プレフィックスが異なる文字列を弾く', () => {
        expect(() => ns.schema.parse('wrong_prefix')).toThrow();
      });

      it('空文字を弾く', () => {
        expect(() => ns.schema.parse('')).toThrow();
      });

      it('プレフィックスのみでもパースできる', () => {
        const result = ns.schema.parse(prefix);
        expect(result).toBe(prefix);
      });
    });
  });
});
