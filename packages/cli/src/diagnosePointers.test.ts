import type { Artifact, LiveRoute, RoutePointer } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { diagnosePointers } from "./diagnosePointers";

const pointer: RoutePointer = {
  route: "/pricing",
  hash: "expected",
  matchKind: "exact",
  updatedAt: "2026-01-01T00:00:00Z",
};
const artifact: Artifact = {
  hash: "expected",
  route: "/pricing",
  documentId: "pricing",
  documentVersion: 1,
  blockVersions: {},
  tree: [],
  meta: { title: "Pricing" },
  compiledWith: "0.0.0",
};

describe("diagnosePointers", () => {
  test("accepts a consistent pointer and names each inconsistent field", () => {
    expect(diagnosePointers([{ pointer, artifact }]).failures).toEqual([]);
    const live: LiveRoute = {
      pointer: { ...pointer, matchKind: "prefix" },
      artifact: { ...artifact, hash: "other", route: "/other" },
    };
    expect(diagnosePointers([live]).failures).toEqual([
      "/pricing has match kind prefix; its route requires exact",
      "/pricing resolved expected to artifact other",
      "/pricing points to an artifact compiled for /other",
    ]);
  });
});
