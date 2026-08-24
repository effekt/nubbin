import type { DocumentVersion } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toAuthorIssue } from "./toAuthorIssue";

const catalog = { Hero: { schema: z.object({ headline: z.string() }) } };

const version: DocumentVersion = {
  documentId: "d1",
  version: 1,
  roots: ["n1"],
  elements: { n1: { id: "n1", block: "Hero", props: { headline: "fine" } } },
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
};

test("an issue at a node the draft holds names its block and field", () => {
  const issue = { message: "expected a string", at: "n1", path: "headline" };
  expect(toAuthorIssue(issue, catalog, version)).toEqual({
    nodeId: "n1",
    blockName: "Hero",
    fieldLabel: "Headline",
    message: "expected a string",
  });
});

test("an at naming no node keeps the raw path and stays unclickable", () => {
  const issue = { message: "route is taken", at: "/pricing", path: "block" };
  expect(toAuthorIssue(issue, catalog, version)).toEqual({
    fieldLabel: "block",
    message: "route is taken",
  });
});

test("an issue with no at or path is just its message", () => {
  expect(toAuthorIssue({ message: "compiler said no" }, catalog, version)).toEqual({
    fieldLabel: undefined,
    message: "compiler said no",
  });
});
