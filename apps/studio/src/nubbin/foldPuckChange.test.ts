import type { DocumentVersion } from "@nubbin/core";
import { expect, test } from "vitest";
import { foldPuckChange } from "./foldPuckChange";
import type { PuckData } from "./puckData.types";

const prior: DocumentVersion = {
  documentId: "d1",
  version: 1,
  roots: ["hero"],
  elements: { hero: { id: "hero", block: "Hero", props: { headline: "old" } } },
  meta: { title: "t" },
  createdAt: "2026-01-01T00:00:00.000Z",
  createdBy: "test",
};

const slots = { Hero: [], CardGrid: ["cards"] };

test("an edit to an existing node folds without touching Puck's own Data", () => {
  const data: PuckData = {
    content: [{ type: "Hero", props: { id: "hero", headline: "new" } }],
    root: { props: { title: "t" } },
  };
  const folded = foldPuckChange(data, prior, slots);
  expect(folded.version.elements.hero?.props.headline).toBe("new");
  expect(folded.data).toBe(data);
});

test("array and object props fold through untouched — a nested edit survives the round trip", () => {
  const statBandPrior: DocumentVersion = {
    ...prior,
    roots: ["band"],
    elements: {
      band: {
        id: "band",
        block: "StatBand",
        props: {
          stats: [
            { value: "6", label: "springs mapped" },
            { value: "3 mi", label: "of shoreline" },
          ],
          tone: "light",
        },
      },
    },
  };
  const edited = [
    { value: "3 mi", label: "of shoreline" },
    { value: "7", label: "springs mapped", note: { by: "ed." } },
  ];
  const data: PuckData = {
    content: [{ type: "StatBand", props: { id: "band", stats: edited, tone: "light" } }],
    root: { props: { title: "t" } },
  };
  const folded = foldPuckChange(data, statBandPrior, { StatBand: [] });
  expect(folded.version.elements.band?.props.stats).toEqual(edited);
  expect(folded.data).toBe(data);
});

test("a node Puck created gets a minted id, and the returned Data holds it", () => {
  const data: PuckData = {
    content: [
      { type: "Hero", props: { id: "hero", headline: "old" } },
      { type: "CardGrid", props: { id: "CardGrid-generated", cards: [] } },
    ],
    root: { props: { title: "t" } },
  };
  const folded = foldPuckChange(data, prior, slots);
  const mintedId = folded.version.roots[1];
  expect(mintedId).toBeDefined();
  expect(mintedId).not.toBe("CardGrid-generated");
  expect(folded.data).not.toBe(data);
  expect(folded.data.content[1]?.props.id).toBe(mintedId);
});

test("a rich text edit folds through as the typed data it is, never a string", () => {
  const prosePrior: DocumentVersion = {
    ...prior,
    roots: ["note"],
    elements: {
      note: {
        id: "note",
        block: "Prose",
        props: {
          heading: "Corrections",
          body: [{ kind: "paragraph", spans: [{ text: "The old table." }] }],
        },
      },
    },
  };
  const edited = [
    {
      kind: "paragraph",
      spans: [
        { text: "The corrected table is " },
        { text: "final", marks: ["strong"] },
        { text: ", see ", marks: [] },
        { text: "the notice", href: "/notice" },
      ],
    },
    { kind: "listItem", spans: [{ text: "posted at the office" }] },
  ];
  const data: PuckData = {
    content: [{ type: "Prose", props: { id: "note", heading: "Corrections", body: edited } }],
    root: { props: { title: "t" } },
  };
  const folded = foldPuckChange(data, prosePrior, { Prose: [] });
  expect(folded.version.elements.note?.props.body).toEqual(edited);
  expect(typeof folded.version.elements.note?.props.body).not.toBe("string");
});
