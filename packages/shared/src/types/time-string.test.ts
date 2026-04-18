import { describe, expect, it } from "vitest";
import { TimeString } from "./time-string";

describe("TimeString", () => {
  describe("parse", () => {
    it("HH:mm形式を受け付ける", () => {
      const result = TimeString.parse("18:00");
      expect(result).toBe("18:00");
    });

    it("深夜0時を受け付ける", () => {
      const result = TimeString.parse("00:00");
      expect(result).toBe("00:00");
    });

    it("秒付きを弾く", () => {
      expect(() => TimeString.parse("18:00:00")).toThrow();
    });

    it("不正な文字列を弾く", () => {
      expect(() => TimeString.parse("not-a-time")).toThrow();
    });

    it("空文字を弾く", () => {
      expect(() => TimeString.parse("")).toThrow();
    });
  });
});
