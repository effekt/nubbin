import { z } from "zod";

/** One line of the board — the same width `ProductCard` gives a name, so an item can move
 * between the two without an edit. */
const MAX_ITEM_LENGTH = 60;

/** Matches `ProductCard`'s bound: a price is printed content, never a number the site does
 * arithmetic on. */
const MAX_PRICE_LENGTH = 12;

/** One item and what it costs, written as the chalk board writes both. */
export const priceRowSchema = z.object({
  item: z.string().max(MAX_ITEM_LENGTH),
  price: z.string().max(MAX_PRICE_LENGTH),
});
