import { z } from "zod";
import { ctaSchema } from "./shared/cta.schema";
import { imageSchema } from "./shared/image.schema";

/** The headline is set in the largest type on the site; past this it wraps to a third line
 * on a phone and stops reading as a headline. Everything live fits, so no version bump. */
const MAX_HEADLINE_LENGTH = 60;

export const heroSchema = z.object({
  eyebrow: z.string(),
  headline: z.string().max(MAX_HEADLINE_LENGTH),
  body: z.string(),
  tone: z.enum(["light", "dark"]),
  cta: ctaSchema,
  image: imageSchema,
});
