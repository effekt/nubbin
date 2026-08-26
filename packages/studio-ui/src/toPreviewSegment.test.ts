import { expect, test } from "vitest";
import { toPreviewSegment } from "./toPreviewSegment";

const base = { issues: [], issuesOpen: false, published: false } as const;

test("says nothing while neither the frame nor a save has proven anything", () => {
  expect(toPreviewSegment(base)).toBeUndefined();
});

test("a loaded frame with no failed save reads connected", () => {
  expect(toPreviewSegment({ ...base, frameLoaded: true })).toEqual({
    kind: "ok",
    text: "Preview connected",
  });
  expect(toPreviewSegment({ ...base, frameLoaded: true, saveFailed: false })).toEqual({
    kind: "ok",
    text: "Preview connected",
  });
});

test("a failed save round trip reads unreachable, whatever the frame said", () => {
  expect(toPreviewSegment({ ...base, saveFailed: true })).toEqual({
    kind: "amber",
    text: "Preview unreachable",
  });
  expect(toPreviewSegment({ ...base, frameLoaded: true, saveFailed: true })).toEqual({
    kind: "amber",
    text: "Preview unreachable",
  });
});
