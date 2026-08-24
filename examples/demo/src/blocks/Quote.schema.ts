import { z } from "zod";
import { attributionSchema } from "./attribution.schema";

/** Two spoken sentences. Past this a pull-quote stops being pulled — it is a paragraph
 * wearing large type, and `Prose` is the block for paragraphs. */
const MAX_TEXT_LENGTH = 240;

/** One voice vouching for the paper, set large. `tone` picks the ground, not a colour —
 * the component resolves each against the demo's contrast table. */
export const quoteSchema = z.object({
  text: z.string().max(MAX_TEXT_LENGTH),
  attribution: attributionSchema,
  tone: z.enum(["light", "dark"]),
});
