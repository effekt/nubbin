import { defineBlock } from "@nubbin/core";
import { LogoWall } from "./LogoWall";
import { logoWallSchema } from "./LogoWall.schema";

/** `grid` doubles as this block's glyph — a wall is a grid of marks, and the palette's name
 * beside it does the telling apart. */
export const logoWallBlock = defineBlock({
  name: "LogoWall",
  description: "A row of the harbours and crews that carry the paper, as marks or set names.",
  icon: "grid",
  category: "Social Proof",
  schema: logoWallSchema,
  component: LogoWall,
  version: 1,
  slots: {},
});
