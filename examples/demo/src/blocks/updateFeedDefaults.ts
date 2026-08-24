import type { z } from "zod";
import type { updateFeedSchema } from "./UpdateFeed.schema";

export const updateFeedDefaults: z.infer<typeof updateFeedSchema> = {
  heading: "Recent changes",
  entries: [
    { text: "Lead dispatch replaced", at: "09:41" },
    { text: "Tide tables corrected for Whitstable", at: "09:14" },
    { text: "Photo essay from the shingle bank added", at: "08:52" },
  ],
};
