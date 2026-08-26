import { expect, test } from "vitest";
import { formatMovedAt } from "./formatMovedAt";

test("date and minutes survive, the T becomes a space", () => {
  expect(formatMovedAt("2026-08-24T14:03:22.512Z")).toBe("2026-08-24 14:03");
});

test("a stamp with no time keeps what it has", () => {
  expect(formatMovedAt("2026-08-24")).toBe("2026-08-24");
});
