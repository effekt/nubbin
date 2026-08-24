import { defineBlock } from "@nubbin/core";
import { CardGrid } from "./CardGrid";
import { cardGridSchema } from "./CardGrid.schema";

/** The narrow allow list is the point: dropping anything but a `Card` here is refused by
 * name — the compiler says which block, which slot, and what the slot accepts instead. */
export const cardGridBlock = defineBlock({
  name: "CardGrid",
  description: "A heading over a grid of cards, filled with Card blocks.",
  icon: "grid",
  schema: cardGridSchema,
  component: CardGrid,
  version: 1,
  slots: { cards: { allow: ["Card"], min: 1, max: 12 } },
});
