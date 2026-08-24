import { z } from "zod";
import { ctaSchema } from "./shared/cta.schema";

/** A header link is one or two words — "Dispatches", "Tide tables". Past this the row of
 * links wraps on a phone and the header stops being one line. */
const MAX_LABEL_LENGTH = 30;

/** One destination in the site header: the shared CTA shape, with the label bounded to
 * what a single header row can carry. */
export const navLinkSchema = ctaSchema.extend({
  label: z.string().max(MAX_LABEL_LENGTH),
});
