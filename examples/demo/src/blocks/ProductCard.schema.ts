import { z } from "zod";
import { imageSchema } from "./shared/image.schema";

/** Room for "Corrected tide tables, spring edition"; past this the name wraps to a third
 * line in a grid cell and stops reading as a label on a thing for sale. */
const MAX_NAME_LENGTH = 60;

/** A price is content, printed exactly as the chandlery chalks it — "£4.50", "two for £8".
 * Twelve characters holds any of those; a number the site could do arithmetic on is a
 * different product, and this paper only reports what the board says. */
const MAX_PRICE_LENGTH = 12;

/** Two short sentences about the thing itself. A longer pitch is a dispatch, and the site
 * has a block for those. */
const MAX_DESCRIPTION_LENGTH = 140;

/** `badge` is the closed pair a buyer cares about — it just arrived, or it is back on the
 * shelf. The component owns the visible wording, so the stored value never changes case. */
export const productCardSchema = z.object({
  name: z.string().max(MAX_NAME_LENGTH),
  price: z.string().max(MAX_PRICE_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH),
  image: imageSchema.optional(),
  href: z.string().optional(),
  badge: z.enum(["new", "back-in-stock"]).optional(),
});
