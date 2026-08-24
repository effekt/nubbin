import { z } from "zod";
import { priceRowSchema } from "./priceRow.schema";

const MAX_HEADING_LENGTH = 60;

/** One row is a `ProductCard`, not a board, and past twelve the board stops being readable
 * at a glance — which is the only way anyone reads a price board. */
const MIN_ROWS = 2;
const MAX_ROWS = 12;

/** The chandlery's printed price board: items down the left, prices down the right.
 * `heading` is optional because the board often hangs under a section that already named
 * the shop. */
export const priceListSchema = z.object({
  heading: z.string().max(MAX_HEADING_LENGTH).optional(),
  rows: z.array(priceRowSchema).min(MIN_ROWS).max(MAX_ROWS),
});
