import { z } from "zod";
import { timedEntrySchema } from "./timedEntry.schema";

export const updateFeedSchema = z.object({
  heading: z.string(),
  entries: z.array(timedEntrySchema),
});
