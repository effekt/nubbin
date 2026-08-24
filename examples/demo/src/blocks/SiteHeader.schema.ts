import { z } from "zod";
import { navLinkSchema } from "./navLink.schema";

/** The masthead is set in one size on one line; a longer name belongs in a hero. */
const MAX_BRAND_LENGTH = 40;

/** Six is where the row wraps on a tablet. A site needing more navigation than this has a
 * footer, and the demo already ships one. */
const MIN_LINKS = 1;
const MAX_LINKS = 6;

/** The top of every page: the paper's name and where the paper goes. `tone` picks the
 * ground; the component owns what each ground looks like. */
export const siteHeaderSchema = z.object({
  brand: z.string().max(MAX_BRAND_LENGTH),
  links: z.array(navLinkSchema).min(MIN_LINKS).max(MAX_LINKS),
  tone: z.enum(["light", "dark"]),
});
