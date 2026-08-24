import type { z } from "zod";
import type { videoHeroSchema } from "./VideoHero.schema";

export const videoHeroDefaults: z.infer<typeof videoHeroSchema> = {
  headline: "An hour of the tide, in forty seconds",
  videoUrl: "/tide-timelapse.mp4",
  poster: {
    url: "/hero-board.svg",
    alt: "Three panels of colour blocks, standing in for the first frame of the tide timelapse",
  },
  overlay: "dusk",
};
