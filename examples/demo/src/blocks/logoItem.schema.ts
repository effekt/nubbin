import { z } from "zod";

/** A mark is a name, not a headline — past 40 characters it is a sentence in a wall. */
const MAX_NAME_LENGTH = 40;

/** One carrier of the paper. `imageUrl` is optional and carries no alt of its own: the mark
 * is the name, so the component uses `name` as the image's text — two fields would let the
 * spoken name and the drawn one drift apart. */
export const logoItemSchema = z.object({
  name: z.string().max(MAX_NAME_LENGTH),
  imageUrl: z.string().optional(),
});
