import type { z } from "zod";
import type { statBandSchema } from "./StatBand.schema";

export const statBandDefaults: z.infer<typeof statBandSchema> = {
  heading: "The estuary, counted",
  stats: [
    { value: "6", label: "harbours read the morning edition" },
    { value: "3 mi", label: "of foreshore walked before writing" },
    { value: "4", label: "springs of tide tables, corrected" },
  ],
  tone: "dark",
};
