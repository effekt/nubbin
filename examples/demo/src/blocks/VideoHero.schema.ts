import { z } from "zod";
import { imageSchema } from "./shared/image.schema";

/** The same cap as `SplitHero`, for the same reason: this headline shares its screen with the
 * media, so past this it crowds the frame it is introducing. */
const MAX_HEADLINE_LENGTH = 70;

/** `poster` is required, not optional: the video never plays until a reader asks it to, so the
 * poster is what every reader sees first, and its `alt` is what a screen reader gets instead. */
export const videoHeroSchema = z.object({
  headline: z.string().max(MAX_HEADLINE_LENGTH),
  videoUrl: z.string(),
  poster: imageSchema,
  overlay: z.enum(["dawn", "dusk", "none"]),
});
