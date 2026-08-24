import { defineBlock } from "@nubbin/core";
import { FeatureGrid } from "./FeatureGrid";
import { featureGridSchema } from "./FeatureGrid.schema";

export const featureGridBlock = defineBlock({
  name: "FeatureGrid",
  description: "Points of value in a grid, an icon and a line each, two to four columns.",
  schema: featureGridSchema,
  component: FeatureGrid,
  version: 1,
  slots: {},
});
