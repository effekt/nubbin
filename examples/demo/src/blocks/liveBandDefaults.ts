import type { z } from "zod";
import type { liveBandSchema } from "./LiveBand.schema";

export const liveBandDefaults: z.infer<typeof liveBandSchema> = {
  label: "On now",
  items: [
    { text: "Spring tide peaking at the harbour wall", at: "14:02" },
    { text: "Gale warning downgraded for the outer estuary", at: "13:47" },
    { text: "Ferry holding to the winter timetable", at: "13:10" },
  ],
};
