import type { z } from "zod";
import type { productGridSchema } from "./ProductGrid.schema";

export const productGridDefaults: z.infer<typeof productGridSchema> = {
  heading: "From the chandlery shelf",
};
