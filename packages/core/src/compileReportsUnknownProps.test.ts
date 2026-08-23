import { describe, expect, test } from "vitest";
import { z } from "zod";
import type { UnknownProps } from "./block.types";
import { compile } from "./compile";
import { createRegistry } from "./createRegistry";
import { defineBlock } from "./defineBlock";
import { defineCatalog } from "./defineCatalog";
import type { DocumentVersion } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";

const schema = z.object({ title: z.string(), cta: z.object({ label: z.string() }) });
const hero = defineBlock({ name: "Hero", schema, component: null, version: 1, slots: {} });
const registry = createRegistry([hero]);
const catalog = defineCatalog({ Hero: { schema } });

const doc = (props: UnknownProps): DocumentVersion => ({
  documentId: "d1",
  version: 1,
  roots: ["n1"],
  elements: { n1: { id: "n1", block: "Hero", props } },
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
});

const good = { title: "T", cta: { label: "Go" } };

/**
 * The one refusal that fails open. A key the schema does not declare still yields a perfectly
 * valid artifact — so `compile` produces it and says what it dropped, rather than either
 * refusing a publishable page or destroying an author's key in silence.
 */
describe("compile reports what the schema dropped", () => {
  test("returns the artifact and no issues when nothing was dropped", () => {
    const { artifact, issues } = compile(doc(good), catalog, registry, "/x");
    expect(artifact.tree[0]?.props).toEqual(good);
    expect(issues).toEqual([]);
  });

  test("still produces the artifact when a key was dropped — this does not refuse", () => {
    const { artifact } = compile(doc({ ...good, heading: "typo" }), catalog, registry, "/x");
    expect(artifact.tree[0]?.props).toEqual(good);
  });

  test("reports the dropped key with the code a consumer branches on", () => {
    const { issues } = compile(doc({ ...good, heading: "typo" }), catalog, registry, "/x");
    expect(issues).toHaveLength(1);
    expect(issues[0]?.code).toBe(NubbinIssueCode.UnknownProp);
  });

  test("names the node and the path, so an editor can select the field", () => {
    const { issues } = compile(doc({ ...good, heading: "typo" }), catalog, registry, "/x");
    expect(issues[0]?.at).toBe("n1");
    expect(issues[0]?.path).toBe("heading");
  });

  test("names a nested key by its dotted path", () => {
    const props = { title: "T", cta: { label: "Go", hrefff: "/x" } };
    const { issues } = compile(doc(props), catalog, registry, "/x");
    expect(issues[0]?.path).toBe("cta.hrefff");
  });

  // A dropped key must not change the address: two documents differing only by a key the schema
  // never kept compile to the same artifact, because they render identically.
  test("a dropped key does not change the content address", () => {
    const { artifact: clean } = compile(doc(good), catalog, registry, "/x");
    const { artifact: typo } = compile(doc({ ...good, heading: "typo" }), catalog, registry, "/x");
    expect(typo.hash).toBe(clean.hash);
  });
});
