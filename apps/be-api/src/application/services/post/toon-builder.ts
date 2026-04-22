import { encode, decode } from '@toon-format/toon';
import type { DateString, EventInfo, TimeString } from '@oshilock/shared';

type ToonEntry = {
  eventId: string;
  category: string;
  startDate: DateString | null;
  startTime: TimeString | null;
  endDate: DateString | null;
  endTime: TimeString | null;
  title: string;
  summary: string;
};

export class ToonBuilder {
  eventInfoToEntry(event: EventInfo): ToonEntry {
    return {
      eventId: event.id,
      category: event.category,
      startDate: event.schedule.startDate,
      startTime: event.schedule.startTime,
      endDate: event.schedule.endDate,
      endTime: event.schedule.endTime,
      title: event.title,
      summary: event.summary,
    };
  }

  entriesToToon(entries: ToonEntry[]): string {
    return encode(entries);
  }

  parseToon(toon: string): ToonEntry[] {
    if (!toon.trim()) return [];
    return decode(toon) as ToonEntry[];
  }

  addOrUpdateEntry(toon: string, entry: ToonEntry): string {
    const entries = this.parseToon(toon);
    const existingIndex = entries.findIndex((e) => e.eventId === entry.eventId);

    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }

    return this.entriesToToon(entries);
  }
}
