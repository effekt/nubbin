import { expect, test } from "vitest";
import { formatSeconds } from "./formatSeconds";

test("milliseconds read as one-decimal seconds", () => {
  expect(formatSeconds(300)).toBe("0.3s");
  expect(formatSeconds(1250)).toBe("1.3s");
});

test("a fast step rounds to zero rather than inventing precision", () => {
  expect(formatSeconds(12)).toBe("0.0s");
});
