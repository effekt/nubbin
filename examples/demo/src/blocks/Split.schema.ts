import { z } from "zod";

/** `ratio` names intent, not measurements: the component owns what "wide" means, so a
 * redesign moves one class map rather than every stored composition.
 * `tone` is optional because a split without one inherits the surface it sits on —
 * the useful default when a pane's children carry surfaces of their own. */
export const splitSchema = z.object({
  ratio: z.enum(["even", "wide-start", "wide-end"]),
  tone: z.enum(["light", "dark"]).optional(),
});
