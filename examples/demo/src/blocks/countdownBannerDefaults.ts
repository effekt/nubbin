import type { z } from "zod";
import type { countdownBannerSchema } from "./CountdownBanner.schema";

export const countdownBannerDefaults: z.infer<typeof countdownBannerSchema> = {
  text: "The equinox spring tide — the highest water of the season — peaks",
  deadline: "2026-09-22T05:41:00Z",
};
