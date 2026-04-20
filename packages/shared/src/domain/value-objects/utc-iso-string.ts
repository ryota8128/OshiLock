import { z } from 'zod';
import { Timezone } from '../../const/timezone';
import { Branded } from './branded';
import { DateString } from './date-string';
import { TimeString } from './time-string';

export type UtcIsoString = Branded<string, 'UtcIsoString'>;

export namespace UtcIsoString {
  export const schema = z.string().datetime().transform(from);

  export function from(value: string): UtcIsoString {
    return value as UtcIsoString;
  }

  export function parse(value: string): UtcIsoString {
    return schema.parse(value);
  }

  export function now(): UtcIsoString {
    return new Date().toISOString() as UtcIsoString;
  }

  export function afterMs(ms: number): UtcIsoString {
    return UtcIsoString.from(new Date(Date.now() + ms).toISOString());
  }

  export function toDateString(value: UtcIsoString, timezone: Timezone): DateString {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone.iana,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return DateString.from(formatter.format(new Date(value)));
  }

  export function toTimeString(value: UtcIsoString, timezone: Timezone): TimeString {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone.iana,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return TimeString.from(formatter.format(new Date(value)));
  }
}
