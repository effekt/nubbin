import { defineBlock } from "@nubbin/core";
import { FaqAccordion } from "./FaqAccordion";
import { faqAccordionSchema } from "./FaqAccordion.schema";

export const faqAccordionBlock = defineBlock({
  name: "FaqAccordion",
  description: "Common questions with their answers, each collapsed until a reader asks.",
  schema: faqAccordionSchema,
  component: FaqAccordion,
  version: 1,
  slots: {},
});
