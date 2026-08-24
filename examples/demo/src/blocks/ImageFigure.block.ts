import { defineBlock } from "@nubbin/core";
import { ImageFigure } from "./ImageFigure";
import { imageFigureSchema } from "./ImageFigure.schema";

/** The palette has no figure glyph, so `card` doubles here — a portrait frame over caption
 * lines is what a figure looks like, and the name beside it does the telling apart. */
export const imageFigureBlock = defineBlock({
  name: "ImageFigure",
  description: "One picture set into the page, with its caption and credit, at three widths.",
  icon: "card",
  schema: imageFigureSchema,
  component: ImageFigure,
  version: 1,
  slots: {},
});
