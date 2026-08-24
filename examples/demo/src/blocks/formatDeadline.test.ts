import { describe, expect, test } from "vitest";
import { formatDeadline } from "./formatDeadline";

describe("formatDeadline", () => {
  test("formats an ISO datetime as day, month and 24-hour time, in UTC", () => {
    expect(formatDeadline("2026-09-22T05:41:00Z")).toBe("22 September at 05:41");
  });

  test("an offset resolves to the same UTC moment", () => {
    expect(formatDeadline("2026-09-22T07:41:00+02:00")).toBe("22 September at 05:41");
  });

  test("midnight keeps both digits rather than rolling to 24", () => {
    expect(formatDeadline("2026-01-05T00:00:00Z")).toBe("5 January at 00:00");
  });
});
