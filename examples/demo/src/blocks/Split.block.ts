import { defineBlock } from "@nubbin/core";
import { Split } from "./Split";
import { splitSchema } from "./Split.schema";

/** One constraint, shared by name: the two panes accept the same blocks by design, and a
 * single object keeps them from drifting apart. Empty is not a pane, and past three the
 * column stops reading as a column. */
const splitPane = {
  allow: ["Prose", "CardGrid", "Card", "UpdateFeed", "LiveBand"],
  min: 1,
  max: 3,
} as const;

/** The first block in the demo with more than one slot — the compiler and the studio both
 * have to tell `start` from `end`, which one-slot blocks never exercised. */
export const splitBlock = defineBlock({
  name: "Split",
  description: "Two blocks side by side, weighted toward either end or balanced.",
  icon: "split",
  category: "Structure",
  schema: splitSchema,
  component: Split,
  version: 1,
  slots: { start: splitPane, end: splitPane },
});
