import { expect, test } from "vitest";
import type { AuthorIssue } from "../nubbin/authorIssue.types";
import { toStatusSegments } from "./toStatusSegments";

const issue: AuthorIssue = { blockName: "Hero", message: "The headline is over its limit." };
const base = { issues: [], issuesOpen: false, published: false } as const;

test("a publish that landed reads up to date", () => {
  const { left } = toStatusSegments({ ...base, published: true }, false);
  expect(left).toEqual([{ kind: "ok", text: "Published · up to date" }]);
});

test("anything unproven reads as edits not yet live", () => {
  const { left } = toStatusSegments(base, false);
  expect(left).toEqual([{ kind: "amber", text: "Newer edits not live yet" }]);
});

test("issues add the fix count, and only while there are any", () => {
  const { left } = toStatusSegments({ ...base, issues: [issue] }, false);
  expect(left[1]).toEqual({ kind: "fix", text: "1 to fix before publish" });
  expect(toStatusSegments(base, false).left).toHaveLength(1);
});

test("the autosave note appears only once a save has landed, saying just now first", () => {
  expect(toStatusSegments(base, false).right).toEqual([]);
  const saved = { ...base, savedAt: "2026-08-24T14:00:00.000Z" };
  expect(toStatusSegments(saved, false).right).toEqual([
    { kind: "plain", text: "Autosaved just now" },
  ]);
  expect(toStatusSegments(saved, true).right).toEqual([{ kind: "plain", text: "Autosaved" }]);
});

test("the preview segment rides the right side once the frame has proven itself", () => {
  expect(toStatusSegments({ ...base, frameLoaded: true }, false).right).toEqual([
    { kind: "ok", text: "Preview connected" },
  ]);
  expect(toStatusSegments({ ...base, saveFailed: true }, false).right).toEqual([
    { kind: "amber", text: "Preview unreachable" },
  ]);
});
