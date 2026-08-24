import { z } from "zod";

const MAX_HEADING_LENGTH = 60;

/** `heading` is optional because the grid often sits inside a section that already said
 * what is for sale; the component still names the set to assistive tech without one. */
export const productGridSchema = z.object({
  heading: z.string().max(MAX_HEADING_LENGTH).optional(),
});
