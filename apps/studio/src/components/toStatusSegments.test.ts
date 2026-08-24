import { expect, test } from "vitest";
import type { AuthorIssue } from "../nubbin/authorIssue.types";
import { toStatusSegments } from "./toStatusSegments";

const issue: AuthorIssue = { blockName: "Hero", message: "The headline is over its limit." };

test("a publish that landed reads up to date", () => {
  const { left } = toStatusSegments({ issues: [], issuesOpen: false, published: true });
  expect(left).toEqual([{ kind: "ok", text: "Published · up to date" }]);
});

test("anything unproven reads as edits not yet live", () => {
  const { left } = toStatusSegments({ issues: [], issuesOpen: false, published: false });
  expect(left).toEqual([{ kind: "amber", text: "Newer edits not live yet" }]);
});

test("issues add the fix count, and only while there are any", () => {
  const { left } = toStatusSegments({ issues: [issue], issuesOpen: false, published: false });
  expect(left[1]).toEqual({ kind: "fix", text: "1 to fix before publish" });
  expect(toStatusSegments({ issues: [], issuesOpen: false, published: false }).left).toHaveLength(
    1,
  );
});

test("the autosave note appears only once a save has landed", () => {
  expect(toStatusSegments({ issues: [], issuesOpen: false, published: false }).right).toEqual([]);
  expect(
    toStatusSegments({
      issues: [],
      issuesOpen: false,
      published: false,
      savedAt: "2026-08-24T14:00:00.000Z",
    }).right,
  ).toEqual([{ kind: "plain", text: "Draft autosaved" }]);
});
