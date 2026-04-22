import { z } from 'zod';
import { Timezone } from '../../const/timezone';
import { Branded } from './branded';

/** "2026-04-18" 形式の日付文字列 */
export type DateString = Branded<string, 'DateString'>;

export namespace DateString {
  export const schema = z.string().date().transform(from);

  export function from(value: string): DateString {
    return value as DateString;
  }

  export function parse(value: string): DateString {
    return schema.parse(value);
  }

  export function fromIsoDateString(isoString: string, timezone: Timezone): DateString {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone.iana,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date(isoString)) as DateString;
  }

  export function addDays(value: DateString, days: number): DateString {
    const date = new Date(value);
    date.setDate(date.getDate() + days);
    return from(date.toISOString().slice(0, 10));
  }

  export function isBefore(a: DateString, b: DateString): boolean {
    return a < b;
  }

  export function isAfter(a: DateString, b: DateString): boolean {
    return a > b;
  }

  export function now(timezone: Timezone): DateString {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone.iana,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date()) as DateString;
  }
}
