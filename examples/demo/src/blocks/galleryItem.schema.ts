import { z } from "zod";
import { imageSchema } from "./shared/image.schema";

/** Shorter than `ImageFigure`'s 140: a gallery caption sits under a picture a third the
 * size, where two lines is already a paragraph. */
const MAX_CAPTION_LENGTH = 100;

/** One picture in a set — the shared image shape, plus the line under it. `alt` stays
 * required by the shared schema; the caption is what a sighted reader gets on top. */
export const galleryItemSchema = imageSchema.extend({
  caption: z.string().max(MAX_CAPTION_LENGTH).optional(),
});
