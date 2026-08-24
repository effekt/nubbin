import { defineBlock } from "@nubbin/core";
import { Quote } from "./Quote";
import { quoteSchema } from "./Quote.schema";

/** `prose` is the closest glyph the palette draws — lines of text — and doubling an icon
 * costs nothing, because the name beside it carries the semantics. */
export const quoteBlock = defineBlock({
  name: "Quote",
  description: "One voice vouching for the paper, set large, with who said it underneath.",
  icon: "prose",
  schema: quoteSchema,
  component: Quote,
  version: 1,
  slots: {},
});
