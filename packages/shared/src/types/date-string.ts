import { Branded } from "./branded";

/** "2026-04-18" 形式の日付文字列 */
export type DateString = Branded<string, "DateString">;

export namespace DateString {
  export function from(value: string): DateString {
    return value as DateString;
  }
}
