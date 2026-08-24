import { z } from "zod";
import { logoItemSchema } from "./logoItem.schema";

const MAX_HEADING_LENGTH = 60;

/** One mark is a mention, not a wall, and past eight the row stops reading as endorsement
 * and starts reading as a directory. */
const MIN_ITEMS = 2;
const MAX_ITEMS = 8;

/** The harbours and crews that carry the paper. `heading` is optional — the wall can sit
 * under a section that already introduced it. */
export const logoWallSchema = z.object({
  heading: z.string().max(MAX_HEADING_LENGTH).optional(),
  items: z.array(logoItemSchema).min(MIN_ITEMS).max(MAX_ITEMS),
});
