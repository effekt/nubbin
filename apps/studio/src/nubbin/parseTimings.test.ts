import { expect, test } from "vitest";
import { parseTimings } from "./parseTimings";

test("three numbers pass through", () => {
  expect(parseTimings({ compileMs: 12, writeMs: 3, moveMs: 45 })).toEqual({
    compileMs: 12,
    writeMs: 3,
    moveMs: 45,
  });
});

test("a missing or mistyped member degrades the whole record", () => {
  expect(parseTimings({ compileMs: 12, writeMs: 3 })).toBeUndefined();
  expect(parseTimings({ compileMs: "12", writeMs: 3, moveMs: 45 })).toBeUndefined();
});

test("absence and non-objects read as undefined, not a throw", () => {
  expect(parseTimings(undefined)).toBeUndefined();
  expect(parseTimings(null)).toBeUndefined();
  expect(parseTimings("fast")).toBeUndefined();
});
