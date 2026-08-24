import { z } from "zod";

export const timedEntrySchema = z.object({
  text: z.string(),
  at: z.string(),
});
