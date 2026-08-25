import { expect, test } from "vitest";
import { overLimitLine } from "./overLimitLine";

test("names the bound and the current length in the design's words", () => {
  expect(overLimitLine(60, 96)).toBe("Keep it under 60 characters — it's 96 now.");
});
