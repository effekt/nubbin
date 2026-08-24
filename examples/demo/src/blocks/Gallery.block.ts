import { defineBlock } from "@nubbin/core";
import { Gallery } from "./Gallery";
import { gallerySchema } from "./Gallery.schema";

export const galleryBlock = defineBlock({
  name: "Gallery",
  description: "A curated set of pictures as a grid or a scrolling strip, each captioned.",
  icon: "gallery",
  category: "Media",
  schema: gallerySchema,
  component: Gallery,
  version: 1,
  slots: {},
});
