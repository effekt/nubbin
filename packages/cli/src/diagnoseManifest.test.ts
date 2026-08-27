import { describe, expect, test } from "vitest";
import { diagnoseManifest } from "./diagnoseManifest";

describe("diagnoseManifest", () => {
  test("reports each repeated route after its first pointer", () => {
    const pointer = {
      route: "/pricing",
      hash: "hash",
      matchKind: "exact" as const,
      updatedAt: "2026-01-01T00:00:00Z",
    };
    expect(
      diagnoseManifest({ routes: [pointer, pointer], generatedAt: "2026-01-01T00:00:00Z" }),
    ).toEqual({
      passes: [],
      failures: ["/pricing appears more than once in the manifest"],
    });
  });
});
