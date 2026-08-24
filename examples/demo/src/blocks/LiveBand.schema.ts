import { z } from "zod";
import { timedEntrySchema } from "./timedEntry.schema";

export const liveBandSchema = z.object({
  label: z.string(),
  items: z.array(timedEntrySchema),
});
