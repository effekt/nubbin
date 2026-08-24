import { describe, expect, test } from "vitest";
import { formatMove } from "./formatMove";

describe("formatMove", () => {
  test("leads with the hash and carries the version and time beside it", () => {
    const line = formatMove({
      hash: "9f2c1a8e4b7d0356",
      documentVersion: 3,
      movedAt: "2026-01-02T03:04:05Z",
    });
    expect(line).toBe("9f2c1a8e4b7d0356 (document v3, moved 2026-01-02T03:04:05Z)");
  });
});
