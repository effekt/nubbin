import type { z } from "zod";
import type { splitSchema } from "./Split.schema";

/** `tone` stays unset so a freshly dropped split inherits the surface it lands on. */
export const splitDefaults: z.infer<typeof splitSchema> = {
  ratio: "wide-start",
};
