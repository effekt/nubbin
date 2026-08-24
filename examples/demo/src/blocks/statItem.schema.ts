import { z } from "zod";

/** The figure is glanced, not read: 12 characters holds "3 mi" and "1,400 words" and refuses
 * a sentence. The label underneath gets the room the figure gives up. */
const MAX_VALUE_LENGTH = 12;
const MAX_LABEL_LENGTH = 40;

/** One figure and what it counts. `value` is display text, not a number — "6" and "3 mi"
 * and "four springs" are all figures a dispatch would set. */
export const statItemSchema = z.object({
  value: z.string().max(MAX_VALUE_LENGTH),
  label: z.string().max(MAX_LABEL_LENGTH),
});
