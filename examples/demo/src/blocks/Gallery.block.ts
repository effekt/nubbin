import { defineBlock } from "@nubbin/core";
import { Gallery } from "./Gallery";
import { gallerySchema } from "./Gallery.schema";

/** `grid` doubles a third time, after `CardGrid` and `LogoWall` — a gallery is a grid of
 * pictures, and a fourth grid glyph would say less than the word beside it does. */
export const galleryBlock = defineBlock({
  name: "Gallery",
  description: "A curated set of pictures as a grid or a scrolling strip, each captioned.",
  icon: "grid",
  schema: gallerySchema,
  component: Gallery,
  version: 1,
  slots: {},
});
