import { describe, expect, test } from "vitest";
import { parseValueLiteral } from "./parseValueLiteral";

describe("parseValueLiteral", () => {
  test.each([
    ["42", 42],
    ["true", true],
    ["null", null],
    ['{"a":1}', { a: 1 }],
    ['["x"]', ["x"]],
  ])("%s arrives typed, as JSON", (raw, value) => {
    expect(parseValueLiteral(raw)).toEqual(value);
  });

  test("what JSON refuses arrives as the string given", () => {
    expect(parseValueLiteral("hello world")).toBe("hello world");
  });

  test("a quoted string arrives unquoted, which is how to say a numeric headline", () => {
    expect(parseValueLiteral('"42"')).toBe("42");
  });
});
