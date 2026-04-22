import { describe, it, expect, beforeAll } from 'vitest';
import { PostEligibilityFilter } from '../domain/service/post-eligibility-filter.js';
import { UtcIsoString } from '@oshilock/shared';

let filter: PostEligibilityFilter;

beforeAll(() => {
  filter = new PostEligibilityFilter();
});

function daysAgo(days: number): UtcIsoString {
  return UtcIsoString.from(new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
}

function daysFromNow(days: number): UtcIsoString {
  return UtcIsoString.from(new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString());
}

describe('PostEligibilityFilter', () => {
  describe('shouldProcess', () => {
    it('未来の日付は処理する', () => {
      expect(filter.shouldProcess({ sortDate: daysFromNow(10) })).toBe(true);
    });

    it('今日は処理する', () => {
      expect(filter.shouldProcess({ sortDate: UtcIsoString.now() })).toBe(true);
    });

    it('29日前は処理する', () => {
      expect(filter.shouldProcess({ sortDate: daysAgo(29) })).toBe(true);
    });

    it('31日前はスキップする', () => {
      expect(filter.shouldProcess({ sortDate: daysAgo(31) })).toBe(false);
    });
  });

  describe('filterToonEntries', () => {
    it('古いエントリを除外する', () => {
      const entries = [
        { eventId: 'e_old', sortDate: daysAgo(31) },
        { eventId: 'e_recent', sortDate: daysAgo(5) },
        { eventId: 'e_now', sortDate: UtcIsoString.now() },
      ];

      const filtered = filter.filterToonEntries(entries);

      expect(filtered).toHaveLength(2);
      expect(filtered.map((e) => e.eventId)).toEqual(['e_recent', 'e_now']);
    });
  });
});
