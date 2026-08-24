import { defineBlock } from "@nubbin/core";
import { CountdownBanner } from "./CountdownBanner";
import { countdownBannerSchema } from "./CountdownBanner.schema";

export const countdownBannerBlock = defineBlock({
  name: "CountdownBanner",
  description: "A dated notice: what is coming, and the moment it arrives.",
  icon: "clock",
  category: "Heroes & Banners",
  schema: countdownBannerSchema,
  component: CountdownBanner,
  version: 1,
  slots: {},
});
