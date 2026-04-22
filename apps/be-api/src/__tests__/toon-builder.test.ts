import { describe, it, expect, beforeAll } from 'vitest';
import { ToonBuilder } from '../application/services/post/toon-builder.js';
import type { EventInfo } from '@oshilock/shared';
import { EventId, OshiId, UserId, UtcIsoString, DateString, TimeString } from '@oshilock/shared';

let builder: ToonBuilder;

beforeAll(() => {
  builder = new ToonBuilder();
});

const MOCK_EVENT: EventInfo = {
  id: EventId.from('e_test001'),
  oshiId: OshiId.from('o_test'),
  title: '夏フェス2026',
  schedule: {
    startDate: DateString.from('2026-07-20'),
    startTime: TimeString.from('14:00'),
    endDate: null,
    endTime: null,
  },
  summary: '夏フェス 東京ガーデンシアター 7/20開催',
  detail: '詳細情報',
  category: 'EVENT',
  sourceReliability: 'SOURCED',
  sourceUrls: [],
  fastestPosterIds: [null, null, null],
  commentCount: 0,
  savedCount: 0,
  tasukaruCount: 0,
  createdAt: UtcIsoString.from('2026-04-22T00:00:00.000Z'),
  updatedAt: UtcIsoString.from('2026-04-22T00:00:00.000Z'),
};

describe('ToonBuilder', () => {
  describe('eventInfoToEntry', () => {
    it('EventInfo から ToonEntry に変換する', () => {
      const entry = builder.eventInfoToEntry(MOCK_EVENT);

      expect(entry.eventId).toBe('e_test001');
      expect(entry.category).toBe('EVENT');
      expect(entry.startDate).toBe('2026-07-20');
      expect(entry.startTime).toBe('14:00');
      expect(entry.endDate).toBeNull();
      expect(entry.endTime).toBeNull();
      expect(entry.title).toBe('夏フェス2026');
      expect(entry.summary).toBe('夏フェス 東京ガーデンシアター 7/20開催');
    });
  });

  describe('entriesToToon', () => {
    it('TOON 形式の文字列を生成する', () => {
      const entry = builder.eventInfoToEntry(MOCK_EVENT);
      const toon = builder.entriesToToon([entry]);

      const expected = [
        '[1]{eventId,category,startDate,startTime,endDate,endTime,title,summary}:',
        '  e_test001,EVENT,2026-07-20,"14:00",null,null,夏フェス2026,夏フェス 東京ガーデンシアター 7/20開催',
      ].join('\n');
      expect(toon).toBe(expected);
    });

    it('複数エントリを含む TOON を生成する', () => {
      const entry1 = builder.eventInfoToEntry(MOCK_EVENT);
      const entry2 = {
        ...entry1,
        eventId: 'e_test002',
        category: 'GOODS',
        startDate: null,
        startTime: null,
        title: '別イベント',
        summary: '別サマリ',
      };
      const toon = builder.entriesToToon([entry1, entry2]);

      const expected = [
        '[2]{eventId,category,startDate,startTime,endDate,endTime,title,summary}:',
        '  e_test001,EVENT,2026-07-20,"14:00",null,null,夏フェス2026,夏フェス 東京ガーデンシアター 7/20開催',
        '  e_test002,GOODS,null,null,null,null,別イベント,別サマリ',
      ].join('\n');
      expect(toon).toBe(expected);
    });
  });

  describe('parseToon', () => {
    it('TOON 文字列からエントリを復元できる', () => {
      const entry = builder.eventInfoToEntry(MOCK_EVENT);
      const toon = builder.entriesToToon([entry]);
      const parsed = builder.parseToon(toon);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].eventId).toBe('e_test001');
      expect(parsed[0].category).toBe('EVENT');
      expect(parsed[0].startDate).toBe('2026-07-20');
      expect(parsed[0].startTime).toBe('14:00');
      expect(parsed[0].endDate).toBeNull();
      expect(parsed[0].endTime).toBeNull();
      expect(parsed[0].title).toBe('夏フェス2026');
      expect(parsed[0].summary).toBe('夏フェス 東京ガーデンシアター 7/20開催');
    });

    it('空文字は空配列を返す', () => {
      expect(builder.parseToon('')).toEqual([]);
      expect(builder.parseToon('  ')).toEqual([]);
    });
  });

  describe('addOrUpdateEntry', () => {
    it('新規エントリを追加する', () => {
      const entry = builder.eventInfoToEntry(MOCK_EVENT);
      const toon = builder.addOrUpdateEntry('', entry);
      const parsed = builder.parseToon(toon);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].eventId).toBe('e_test001');
    });

    it('既存エントリを更新する', () => {
      const entry = builder.eventInfoToEntry(MOCK_EVENT);
      const initialToon = builder.entriesToToon([entry]);

      const updatedEntry = { ...entry, title: '夏フェス2026（更新）' };
      const updatedToon = builder.addOrUpdateEntry(initialToon, updatedEntry);
      const parsed = builder.parseToon(updatedToon);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].title).toBe('夏フェス2026（更新）');
    });

    it('異なる eventId なら追加される', () => {
      const entry1 = builder.eventInfoToEntry(MOCK_EVENT);
      const entry2 = { ...entry1, eventId: 'e_test002', title: '別イベント' };

      const toon = builder.addOrUpdateEntry('', entry1);
      const updatedToon = builder.addOrUpdateEntry(toon, entry2);
      const parsed = builder.parseToon(updatedToon);

      expect(parsed).toHaveLength(2);
    });
  });
});
