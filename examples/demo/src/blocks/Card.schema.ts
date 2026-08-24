import { z } from "zod";

/** `badge` is the closed pair a reader actually needs — something arrived, or something
 * moved. The component owns the visible wording, so the stored value never changes case. */
export const cardSchema = z.object({
  title: z.string(),
  summary: z.string(),
  href: z.string().optional(),
  meta: z.string().optional(),
  badge: z.enum(["new", "updated"]).optional(),
});
