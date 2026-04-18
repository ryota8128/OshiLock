import { z } from "zod";
import { Timezone } from "../const/timezone";
import { Branded } from "./branded";
import { DateString } from "./date-string";
import { TimeString } from "./time-string";

export type UtcIsoString = Branded<string, "UtcIsoString">;

export namespace UtcIsoString {
  export function now(): UtcIsoString {
    return new Date().toISOString() as UtcIsoString;
  }

  export function from(value: string): UtcIsoString {
    return value as UtcIsoString;
	}

	export function parse(value: string): UtcIsoString {
		const parsed = z.string().datetime().parse(value);
		return parsed as UtcIsoString;
	}

  export function toDateString(value: UtcIsoString, timezone: Timezone): DateString {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone.iana,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return DateString.from(formatter.format(new Date(value)));
  }

  export function toTimeString(value: UtcIsoString, timezone: Timezone): TimeString {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone.iana,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return TimeString.from(formatter.format(new Date(value)));
  }
}
