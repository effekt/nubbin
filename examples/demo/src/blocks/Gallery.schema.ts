import { z } from "zod";
import { galleryItemSchema } from "./galleryItem.schema";

const MAX_HEADING_LENGTH = 60;

/** One picture is an `ImageFigure`, not a gallery, and past eight the set stops being a
 * selection — the demo's point is curation, and a cap is what curation feels like. */
const MIN_ITEMS = 2;
const MAX_ITEMS = 8;

/** A set of pictures, laid as a grid or a scrolling strip. `heading` is optional because
 * the set often sits inside a section that already said what it shows. */
export const gallerySchema = z.object({
  heading: z.string().max(MAX_HEADING_LENGTH).optional(),
  items: z.array(galleryItemSchema).min(MIN_ITEMS).max(MAX_ITEMS),
  layout: z.enum(["grid", "strip"]),
});
