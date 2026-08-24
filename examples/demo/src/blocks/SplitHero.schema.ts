import { z } from "zod";
import { ctaSchema } from "./shared/cta.schema";
import { imageSchema } from "./shared/image.schema";

/** Ten more than `Hero`'s cap: this headline sits beside its media rather than over the full
 * width, so it is set a size down and holds one more clause before it wraps badly. */
const MAX_HEADLINE_LENGTH = 70;

/** `image` is optional as a whole, and `alt` is required inside it — an image without alt text
 * is not a state an author can save, while a text-only opener is. */
export const splitHeroSchema = z.object({
  headline: z.string().max(MAX_HEADLINE_LENGTH),
  body: z.string(),
  mediaSide: z.enum(["start", "end"]),
  image: imageSchema.optional(),
  cta: ctaSchema.optional(),
});
