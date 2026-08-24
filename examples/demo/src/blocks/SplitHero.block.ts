import { defineBlock } from "@nubbin/core";
import { SplitHero } from "./SplitHero";
import { splitHeroSchema } from "./SplitHero.schema";

/** Kept apart from `Hero` rather than widening it: `Hero` requires its image and action, and
 * this one treats both as an author's choice — one schema doing both would make every field
 * optional and every page's opener a guess. */
export const splitHeroBlock = defineBlock({
  name: "SplitHero",
  description: "An opener in two halves: headline and standfirst one side, media the other.",
  icon: "split",
  schema: splitHeroSchema,
  component: SplitHero,
  version: 1,
  slots: {},
});
