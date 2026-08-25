import { addNode } from "@nubbin/core";
import { expect, test } from "vitest";
import { fixtureRoutes } from "../../../examples/demo/fixtures/fixtureRoutes";
import { lateEdition } from "../../../examples/demo/fixtures/lateEdition";
import { cardDefaults } from "../../../examples/demo/src/blocks/cardDefaults";
import { fromPuckData } from "./fromPuckData";
import { isPuckSlotValue } from "./isPuckSlotValue";
import type { PuckComponentData, PuckData } from "./puckData.types";
import { toPuckData } from "./toPuckData";

function slotChildren(component: PuckComponentData | undefined, key: string): PuckComponentData[] {
  const value = component?.props[key];
  if (!isPuckSlotValue(value)) throw new Error(`"${key}" is not a slot value on this component`);
  return value;
}

function withCardInserted(data: PuckData): PuckData {
  const stack = data.content[0];
  const sections = slotChildren(stack, "sections");
  const grid = sections.find((section) => section.props.id === "grid");
  slotChildren(grid, "cards").push({
    type: "Card",
    props: { id: "Card-7f3a-puck-minted", ...cardDefaults, title: "Filed from the quay" },
  });
  return data;
}

test.each(Object.entries(fixtureRoutes))(
  "the %s fixture round-trips to itself untouched",
  (_route, fixture) => {
    expect(fromPuckData(toPuckData(fixture), fixture)).toStrictEqual(fixture);
  },
);

test("puck data round-trips back to itself through the draft", () => {
  const data = toPuckData(lateEdition);
  expect(toPuckData(fromPuckData(data, lateEdition))).toStrictEqual(data);
});

test("all four meta fields round-trip through root.props", () => {
  const meta = {
    title: "Late edition",
    description: "The evening dispatch, held for the tide table.",
    robots: "noindex, nofollow",
    canonical: "https://bellwether.test/late-edition",
  };
  const version = { ...lateEdition, meta };
  const data = toPuckData(version);
  expect(data.root.props).toStrictEqual(meta);
  expect(fromPuckData(data, version).meta).toStrictEqual(meta);
});

test("an optional meta field emptied in the editor folds back to absent", () => {
  const version = {
    ...lateEdition,
    meta: { ...lateEdition.meta, description: "Standing description" },
  };
  const data = toPuckData(version);
  data.root.props = { ...data.root.props, description: "", robots: "" };
  expect(fromPuckData(data, version).meta).toStrictEqual({ title: lateEdition.meta.title });
});

test("a puck insert produces the document addNode would have", () => {
  const edited = fromPuckData(withCardInserted(toPuckData(lateEdition)), lateEdition, () => "n-1");
  const viaAddNode = addNode(lateEdition, "grid", "cards", {
    id: "n-1",
    block: "Card",
    props: { ...cardDefaults, title: "Filed from the quay" },
  });
  expect(edited).toStrictEqual(viaAddNode);
});

test("the default mint yields a fresh valid id the draft does not hold", () => {
  const edited = fromPuckData(withCardInserted(toPuckData(lateEdition)), lateEdition);
  const grid = edited.elements.grid;
  const minted = grid?.slots?.cards?.at(-1);
  if (minted === undefined) throw new Error("the inserted card reached no slot");
  expect(minted).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  expect(Object.hasOwn(lateEdition.elements, minted)).toBe(false);
  expect(edited.elements[minted]?.block).toBe("Card");
});

test("identity fields carry over from the prior draft, unbumped", () => {
  const edited = fromPuckData(toPuckData(lateEdition), lateEdition);
  expect(edited.documentId).toBe(lateEdition.documentId);
  expect(edited.version).toBe(lateEdition.version);
  expect(edited.createdAt).toBe(lateEdition.createdAt);
  expect(edited.createdBy).toBe(lateEdition.createdBy);
});
