import { z } from "zod";

/** `heading` is optional because a grid inside a `Split` pane usually sits under the pane's
 * own heading. `columns` is a closed pair — the card width that stays readable bounds it. */
export const cardGridSchema = z.object({
  heading: z.string().optional(),
  columns: z.enum(["two", "three"]),
});
