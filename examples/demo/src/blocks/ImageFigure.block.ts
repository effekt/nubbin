import { defineBlock } from "@nubbin/core";
import { ImageFigure } from "./ImageFigure";
import { imageFigureSchema } from "./ImageFigure.schema";

export const imageFigureBlock = defineBlock({
  name: "ImageFigure",
  description: "One picture set into the page, with its caption and credit, at three widths.",
  icon: "figure",
  schema: imageFigureSchema,
  component: ImageFigure,
  version: 1,
  slots: {},
});
