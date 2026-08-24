import { z } from "zod";
import { statItemSchema } from "./statItem.schema";

const MAX_HEADING_LENGTH = 60;

/** One figure is a claim, not a band, and past four the row wraps into the grid that
 * `FeatureGrid` already is. */
const MIN_STATS = 2;
const MAX_STATS = 4;

/** A row of figures the paper stands on. `tone` picks the ground; `heading` is optional
 * because the band often sits under a section that already said what it counts. */
export const statBandSchema = z.object({
  heading: z.string().max(MAX_HEADING_LENGTH).optional(),
  stats: z.array(statItemSchema).min(MIN_STATS).max(MAX_STATS),
  tone: z.enum(["light", "dark"]),
});
