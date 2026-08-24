import { defineBlock } from "@nubbin/core";
import { StatBand } from "./StatBand";
import { statBandSchema } from "./StatBand.schema";

/** `band` is shared with the other full-width strips — the palette tells them apart by
 * name, and a third glyph for a third strip would say less than the word does. */
export const statBandBlock = defineBlock({
  name: "StatBand",
  description: "A strip of figures the paper stands on, each with what it counts.",
  icon: "band",
  category: "Social Proof",
  schema: statBandSchema,
  component: StatBand,
  version: 1,
  slots: {},
});
