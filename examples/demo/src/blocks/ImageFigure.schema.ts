import { z } from "zod";
import { imageSchema } from "./shared/image.schema";

/** A caption is a sentence under a picture, not a paragraph beside one; a credit is a name.
 * Past these bounds each starts doing the other's job. */
const MAX_CAPTION_LENGTH = 140;
const MAX_CREDIT_LENGTH = 60;

/** The picture is the block: unlike `SplitHero`, `image` is required here, because a figure
 * with nothing in its frame is not a state worth saving. `width` says how far the frame runs —
 * the prose measure, a size up, or the full bleed. */
export const imageFigureSchema = z.object({
  image: imageSchema,
  caption: z.string().max(MAX_CAPTION_LENGTH).optional(),
  credit: z.string().max(MAX_CREDIT_LENGTH).optional(),
  width: z.enum(["text", "wide", "full"]),
});
