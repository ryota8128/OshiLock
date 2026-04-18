import { z } from "zod";
import { REGEX } from "../const/regex";
import { Timezone } from "../const/timezone";
import { Branded } from "./branded";

/** "18:00" 形式の時刻文字列 */
export type TimeString = Branded<string, "TimeString">;

export namespace TimeString {
  export function now(timezone: Timezone): TimeString {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone.iana,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formatter.format(new Date()) as TimeString;
  }

  export function from(value: string): TimeString {
    return value as TimeString;
  }

  export function parse(value: string): TimeString {
    const parsed = z.string().regex(REGEX.TIME_STRING).parse(value);
    return parsed as TimeString;
  }
}
