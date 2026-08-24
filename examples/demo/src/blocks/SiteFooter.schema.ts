import { z } from "zod";
import { footerColumnSchema } from "./footerColumn.schema";

/** The footer grid holds the tagline plus exactly three column tracks on desktop; a fourth
 * column wraps below the first and reads as a mistake, so the list is closed at three. */
const MAX_COLUMNS = 3;

export const siteFooterSchema = z.object({
  tagline: z.string(),
  tone: z.enum(["light", "dark"]),
  columns: z.array(footerColumnSchema).max(MAX_COLUMNS),
  legal: z.string(),
});
