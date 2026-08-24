import type { z } from "zod";
import type { cardGridSchema } from "./CardGrid.schema";

export const cardGridDefaults: z.infer<typeof cardGridSchema> = {
  heading: "Latest from the field",
  columns: "three",
};
