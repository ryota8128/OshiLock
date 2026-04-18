import { Branded } from "./branded";

/** "18:00" 形式の時刻文字列 */
export type TimeString = Branded<string, "TimeString">;

export namespace TimeString {
  export function from(value: string): TimeString {
    return value as TimeString;
  }
}
