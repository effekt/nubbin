import { defineBlock } from "@nubbin/core";
import { VideoHero } from "./VideoHero";
import { videoHeroSchema } from "./VideoHero.schema";

/** The video is a URL and nothing else — an embed script in a prop would be code in an
 * artifact, which invariant 6 forbids. A native player needs only the address. */
export const videoHeroBlock = defineBlock({
  name: "VideoHero",
  description: "An opener led by moving water: headline over a poster that plays on request.",
  icon: "video",
  schema: videoHeroSchema,
  component: VideoHero,
  version: 1,
  slots: {},
});
