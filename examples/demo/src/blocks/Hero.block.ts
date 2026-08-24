import { defineBlock } from "@nubbin/core";
import { Hero } from "./Hero";
import { heroSchema } from "./Hero.schema";

export const heroBlock = defineBlock({
  name: "Hero",
  description:
    "The opening statement of a page: headline, supporting line, image and one call to action.",
  schema: heroSchema,
  component: Hero,
  version: 1,
  slots: {},
});
