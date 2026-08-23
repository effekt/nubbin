import { describe, expect, test } from "vitest";
import { formatPointer } from "./formatPointer";

describe("formatPointer", () => {
  test("one pointer as one line: the route, the hash it resolves to, and when it moved", () => {
    const line = formatPointer({
      route: "/pricing",
      matchKind: "exact",
      hash: "9f2c1a",
      updatedAt: "2026-01-01T00:00:00Z",
    });
    expect(line).toBe("/pricing -> 9f2c1a (moved 2026-01-01T00:00:00Z)");
  });
});
