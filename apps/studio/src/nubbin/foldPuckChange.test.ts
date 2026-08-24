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
