import type { DocumentVersion } from "@nubbin/core";
import { compile, createRegistry, defineBlock, defineCatalog, NubbinError } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toAuthorIssues } from "./toAuthorIssues";

const heroSchema = z.object({ headline: z.string().max(80) });
const cardSchema = z.object({ label: z.string() });
const hero = defineBlock({
  name: "Hero",
  schema: heroSchema,
  component: null,
  version: 1,
  slots: { items: { allow: ["Card"], min: 1 } },
});
const card = defineBlock({
  name: "Card",
  schema: cardSchema,
  component: null,
  version: 1,
  slots: {},
});
const registry = createRegistry([hero, card]);
const catalog = defineCatalog({ Hero: { schema: heroSchema }, Card: { schema: cardSchema } });

const doc = (elements: DocumentVersion["elements"]): DocumentVersion => ({
  documentId: "d1",
  version: 1,
  roots: ["n1"],
  elements,
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
});

function refusalOf(version: DocumentVersion): NubbinError {
  try {
    compile(version, catalog, registry, "/");
  } catch (error) {
    if (error instanceof NubbinError) return error;
  }
  throw new Error("the compiler accepted a document this test needs refused");
}

test("a schema violation names the block and the field in author words", () => {
  const version = doc({
    n1: {
      id: "n1",
      block: "Hero",
      props: { headline: "x".repeat(81) },
      slots: { items: ["n2"] },
    },
    n2: { id: "n2", block: "Card", props: { label: "L" } },
  });
  const [issue] = toAuthorIssues(refusalOf(version), catalog, version);
  expect(issue).toMatchObject({ nodeId: "n1", blockName: "Hero", fieldLabel: "Headline" });
  expect(issue?.message).toMatch(/80/);
});

test("a slot below its min names the block and the slot", () => {
  const version = doc({
    n1: { id: "n1", block: "Hero", props: { headline: "fine" }, slots: { items: [] } },
  });
  const [issue] = toAuthorIssues(refusalOf(version), catalog, version);
  expect(issue).toMatchObject({ nodeId: "n1", blockName: "Hero", fieldLabel: "Items" });
  expect(issue?.message).toMatch(/at least 1/);
});

test("a path no schema segment labels falls back to the raw path", () => {
  const version = doc({
    n1: { id: "n1", block: "Hero", props: { headline: "fine" }, slots: { items: ["n2"] } },
    n2: { id: "n2", block: "Card", props: { label: "L" } },
  });
  const issues = toAuthorIssues(
    [{ message: "left over from an older schema", at: "n1", path: "legacy.knob" }],
    catalog,
    version,
  );
  expect(issues[0]).toMatchObject({ blockName: "Hero", fieldLabel: "legacy.knob" });
});

test("an issue naming no node keeps only its message and raw path", () => {
  const version = doc({});
  const issues = toAuthorIssues([{ message: "route is taken", at: "/pricing" }], catalog, version);
  expect(issues[0]).toEqual({ fieldLabel: undefined, message: "route is taken" });
});

test("a value that is not issue-shaped still surfaces as a message", () => {
  const issues = toAuthorIssues(["the server fell over", { odd: true }], catalog, doc({}));
  expect(issues.map((issue) => issue.message)).toEqual(["the server fell over", '{"odd":true}']);
});
