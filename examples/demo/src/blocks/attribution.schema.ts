import { z } from "zod";

/** A name never wraps at 60; a role gets more room because titles run long ("harbourmaster,
 * eastern arm") and the smaller setting below the name absorbs the extra line. */
const MAX_NAME_LENGTH = 60;
const MAX_ROLE_LENGTH = 80;

/** Who said it. `role` is optional — a reader's word stands on the name alone, while a
 * harbourmaster's carries the office that makes it worth quoting. */
export const attributionSchema = z.object({
  name: z.string().max(MAX_NAME_LENGTH),
  role: z.string().max(MAX_ROLE_LENGTH).optional(),
});
