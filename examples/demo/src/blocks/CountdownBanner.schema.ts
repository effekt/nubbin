import { z } from "zod";

/** The line shares its bar with the date it introduces, so it gets less room than an
 * announcement: past this the pair wraps and the bar reads as two notices. */
const MAX_TEXT_LENGTH = 80;

/** `deadline` is a full ISO datetime, not display text — the component formats it, and a
 * `<time>` element carries the machine-readable value beside the words. */
export const countdownBannerSchema = z.object({
  text: z.string().max(MAX_TEXT_LENGTH),
  deadline: z.iso.datetime(),
});
