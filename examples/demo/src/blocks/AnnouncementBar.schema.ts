import { z } from "zod";

/** One line, literally: past this the bar wraps on a phone and stops being a bar. A notice
 * needing two sentences is a dispatch, and the site has a block for those. */
const MAX_TEXT_LENGTH = 90;

/** `tone` names how urgent the notice is, never a colour — the component owns what each
 * urgency looks like. `href` is optional: some notices go somewhere, some just stand. */
export const announcementBarSchema = z.object({
  text: z.string().max(MAX_TEXT_LENGTH),
  href: z.string().optional(),
  tone: z.enum(["notice", "urgent"]),
});
