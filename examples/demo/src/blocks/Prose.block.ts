import { defineBlock } from "@nubbin/core";
import { Prose } from "./Prose";
import { proseSchema } from "./Prose.schema";

export const proseBlock = defineBlock({
  name: "Prose",
  description: "A heading over paragraphs of rich text, for the pages that mostly say something.",
  icon: "prose",
  schema: proseSchema,
  component: Prose,
  version: 2,
  slots: {},
});
