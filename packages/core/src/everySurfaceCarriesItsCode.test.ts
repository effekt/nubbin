import { describe, expect, test } from "vitest";
import { z } from "zod";
import { addNode } from "./addNode";
import { compile } from "./compile";
import { createRegistry } from "./createRegistry";
import { defineBlock } from "./defineBlock";
import { defineCatalog } from "./defineCatalog";
import type { DocumentVersion, Node } from "./document.types";
import { moveNode } from "./moveNode";
import { NubbinError } from "./NubbinError";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { removeNode } from "./removeNode";
import { setAtPath } from "./setAtPath";
import { setNodeProp } from "./setNodeProp";

/**
 * The contract this file exists for: a refusal is not prose a consumer parses, it is a code they
 * branch on. Every surface that throws is exercised here and asserted on `error.code`, so a
 * message reworded for clarity cannot silently change what a program keys off.
 *
 * It is also the list. A code with no row here is a code nothing raises, and a surface with no
 * row is one whose refusal is undocumented — both are visible by reading this file against
 * `NubbinIssueCode`.
 */
const schema = z.object({ title: z.string() });
/** An array field, so a hint can name a path that resolves and still addresses no single value. */
const listSchema = z.object({ items: z.array(z.string()) });
const hero = defineBlock({ name: "Hero", schema, component: null, version: 1, slots: {} });

const node = (id: string, extra: Partial<Node> = {}): Node => ({
  id,
  block: "Hero",
  props: { title: "T" },
  ...extra,
});

const doc = (elements: Record<string, Node>, roots = ["n1"]): DocumentVersion => ({
  documentId: "d1",
  version: 1,
  roots,
  elements,
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00Z",
  createdBy: "test",
});

/** Runs the thunk and returns the `NubbinError` it threw, failing if it threw anything else. */
function refusalFrom(act: () => unknown): NubbinError {
  try {
    act();
  } catch (error) {
    if (error instanceof NubbinError) {
      return error;
    }
    throw error;
  }
  throw new Error("expected a refusal, got a value");
}

describe("every throwing surface carries its code", () => {
  test.each([
    [
      NubbinIssueCode.BlockVersion,
      () => defineBlock({ name: "H", schema, component: null, version: 0, slots: {} }),
    ],
    [
      NubbinIssueCode.SlotBounds,
      () =>
        defineBlock({
          name: "H",
          schema,
          component: null,
          version: 1,
          slots: { items: { min: 3, max: 1 } },
        }),
    ],
    [NubbinIssueCode.DuplicateBlockName, () => createRegistry([hero, defineBlock({ ...hero })])],
    [
      NubbinIssueCode.SlotAllowUnknown,
      () =>
        createRegistry([
          defineBlock({
            name: "H",
            schema,
            component: null,
            version: 1,
            slots: { items: { allow: ["Nope"] } },
          }),
        ]),
    ],
    [
      NubbinIssueCode.InvalidDefaults,
      () => defineCatalog({ Hero: { schema, defaults: { title: 42 } } }),
    ],
    [
      NubbinIssueCode.HintPathUnresolvable,
      () => defineCatalog({ Hero: { schema, ui: { fields: { nope: {} } } } }),
    ],
    [
      NubbinIssueCode.HintNotAddressable,
      () =>
        defineCatalog({
          List: { schema: listSchema, ui: { fields: { "items[]": { data: { revalidate: 5 } } } } },
        }),
    ],
    [NubbinIssueCode.NoSuchNode, () => setNodeProp(doc({ n1: node("n1") }), "ghost", "title", "x")],
    [
      NubbinIssueCode.DuplicateNodeId,
      () => addNode(doc({ n1: node("n1") }), "n1", "items", node("n1")),
    ],
    [NubbinIssueCode.PathNotAddressable, () => setAtPath({ items: ["a"] }, "items.0", "x")],
    [
      NubbinIssueCode.InvalidRoute,
      () =>
        compile(
          doc({ n1: node("n1") }),
          defineCatalog({ Hero: { schema } }),
          createRegistry([hero]),
          "no-slash",
        ),
    ],
    [
      NubbinIssueCode.NoRoots,
      () =>
        compile(
          doc({ n1: node("n1") }, []),
          defineCatalog({ Hero: { schema } }),
          createRegistry([hero]),
          "/x",
        ),
    ],
    [
      NubbinIssueCode.InvalidProps,
      () =>
        compile(
          doc({ n1: node("n1", { props: { title: 42 } }) }),
          defineCatalog({ Hero: { schema } }),
          createRegistry([hero]),
          "/x",
        ),
    ],
    [
      NubbinIssueCode.DanglingChild,
      () =>
        compile(
          doc({ n1: node("n1", { slots: { items: ["ghost"] } }) }),
          defineCatalog({ Hero: { schema } }),
          createRegistry([hero]),
          "/x",
        ),
    ],
  ])("%s", (code, act) => {
    expect(refusalFrom(act).code).toBe(code);
  });

  test("a refusal from removeNode and moveNode names the node the caller got wrong", () => {
    const version = doc({ n1: node("n1") });
    expect(refusalFrom(() => removeNode(version, "ghost")).code).toBe(NubbinIssueCode.NoSuchNode);
    expect(refusalFrom(() => moveNode(version, "ghost", "n1", "items")).code).toBe(
      NubbinIssueCode.NoSuchNode,
    );
  });

  // The code is the contract; the prose is not. Both travel, and only one is branched on.
  test("a refusal carries the reading prose beside the code, not instead of it", () => {
    const refusal = refusalFrom(() => setNodeProp(doc({ n1: node("n1") }), "ghost", "title", "x"));
    expect(refusal.message).toContain("ghost");
    expect(refusal.issues[0]?.at).toBe("ghost");
  });
});
