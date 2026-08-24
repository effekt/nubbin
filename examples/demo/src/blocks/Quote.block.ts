import { defineBlock } from "@nubbin/core";
import { Quote } from "./Quote";
import { quoteSchema } from "./Quote.schema";

export const quoteBlock = defineBlock({
  name: "Quote",
  description: "One voice vouching for the paper, set large, with who said it underneath.",
  icon: "quote",
  schema: quoteSchema,
  component: Quote,
  version: 1,
  slots: {},
});
