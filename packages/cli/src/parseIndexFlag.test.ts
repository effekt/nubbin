import { describe, expect, test } from "vitest";
import { parseIndexFlag } from "./parseIndexFlag";
import { UsageError } from "./UsageError";

describe("parseIndexFlag", () => {
  test("reads a whole number as a position", () => {
    expect(parseIndexFlag("0")).toBe(0);
    expect(parseIndexFlag("12")).toBe(12);
  });

  test.each(["-1", "1.5", "two", ""])("refuses %j, naming the flag", (raw) => {
    expect(() => parseIndexFlag(raw)).toThrow(UsageError);
    expect(() => parseIndexFlag(raw)).toThrow(/--index/);
  });
});
