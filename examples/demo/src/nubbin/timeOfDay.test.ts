import { describe, expect, test } from "vitest";
import { timeOfDay } from "./timeOfDay";

describe("timeOfDay", () => {
  test("reads the hour and minute out of an instant", () => {
    expect(timeOfDay(Date.parse("2026-08-24T14:02:31.000Z"))).toBe("14:02");
  });

  test("keeps a leading zero, so the column stays aligned", () => {
    expect(timeOfDay(Date.parse("2026-08-24T04:07:00.000Z"))).toBe("04:07");
  });
});
