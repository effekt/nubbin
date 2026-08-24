import { defineBlock } from "@nubbin/core";
import { Card } from "./Card";
import { cardSchema } from "./Card.schema";

/** The leaf the composition blocks exist to arrange: a card is the smallest thing a reader
 * notices moving on a page, which is what the `badge` pill makes visible. */
export const cardBlock = defineBlock({
  name: "Card",
  schema: cardSchema,
  component: Card,
  version: 1,
  slots: {},
});
