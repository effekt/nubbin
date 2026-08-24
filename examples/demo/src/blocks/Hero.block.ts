import { defineBlock } from "@nubbin/core";
import { Hero } from "./Hero";
import { heroSchema } from "./Hero.schema";

export const heroBlock = defineBlock({
  name: "Hero",
  description:
    "The opening statement of a page: headline, supporting line, image and one call to action.",
  icon: "hero",
  docs: {
    figma: "https://example.com/figma/hero",
    storybook: "https://example.com/storybook/hero",
  },
  schema: heroSchema,
  component: Hero,
  version: 1,
  slots: {},
});
