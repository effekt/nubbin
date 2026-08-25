import type { DocumentVersion, Node } from "@nubbin/core";
import { expect, test } from "vitest";
import type { FromPuckContext } from "./fromPuckComponent";
import { fromPuckComponent } from "./fromPuckComponent";

function priorWith(elements: Record<string, Node>): DocumentVersion {
  return {
    documentId: "d1",
    version: 1,
    roots: Object.keys(elements),
    elements,
    meta: { title: "T" },
    createdAt: "2026-08-24T00:00:00Z",
    createdBy: "tests",
  };
}

function contextWith(elements: Record<string, Node>): FromPuckContext {
  return {
    prior: priorWith(elements),
    elements: {},
    mintId: () => "minted-1",
  };
}

test("an id the prior draft holds passes through unchanged", () => {
  const ctx = contextWith({ n1: { id: "n1", block: "Card", props: {} } });
  expect(fromPuckComponent({ type: "Card", props: { id: "n1", title: "T" } }, ctx)).toBe("n1");
  expect(ctx.elements.n1).toStrictEqual({ id: "n1", block: "Card", props: { title: "T" } });
});

test("an id Puck created is replaced by a minted one", () => {
  const ctx = contextWith({});
  expect(fromPuckComponent({ type: "Card", props: { id: "Card-7f3a", title: "T" } }, ctx)).toBe(
    "minted-1",
  );
  expect(ctx.elements["minted-1"]?.id).toBe("minted-1");
});

test("a non-empty child array splits into a slot of ids, in order", () => {
  const ctx = contextWith({
    stack: { id: "stack", block: "SectionStack", props: {}, slots: { sections: ["a", "b"] } },
    a: { id: "a", block: "Card", props: {} },
    b: { id: "b", block: "Card", props: {} },
  });
  fromPuckComponent(
    {
      type: "SectionStack",
      props: {
        id: "stack",
        sections: [
          { type: "Card", props: { id: "b" } },
          { type: "Card", props: { id: "a" } },
        ],
      },
    },
    ctx,
  );
  expect(ctx.elements.stack?.slots).toStrictEqual({ sections: ["b", "a"] });
});

test("an emptied slot the prior node held stays a slot", () => {
  const ctx = contextWith({
    grid: { id: "grid", block: "CardGrid", props: {}, slots: { cards: [] } },
  });
  fromPuckComponent({ type: "CardGrid", props: { id: "grid", cards: [] } }, ctx);
  expect(ctx.elements.grid).toStrictEqual({
    id: "grid",
    block: "CardGrid",
    props: {},
    slots: { cards: [] },
  });
});

test("an empty ordinary array prop stays a prop", () => {
  const ctx = contextWith({ nav: { id: "nav", block: "Nav", props: { links: [] } } });
  fromPuckComponent({ type: "Nav", props: { id: "nav", links: [] } }, ctx);
  expect(ctx.elements.nav).toStrictEqual({ id: "nav", block: "Nav", props: { links: [] } });
});

test("a node with no slot props gets no slots key at all", () => {
  const ctx = contextWith({ n1: { id: "n1", block: "Card", props: {} } });
  fromPuckComponent({ type: "Card", props: { id: "n1" } }, ctx);
  expect(Object.hasOwn(ctx.elements.n1 ?? {}, "slots")).toBe(false);
});
