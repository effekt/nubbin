import type { z } from "zod";
import type { priceListSchema } from "./PriceList.schema";

export const priceListDefaults: z.infer<typeof priceListSchema> = {
  heading: "At the back counter",
  rows: [
    { item: "Single dispatch, printed", price: "£1.20" },
    { item: "A year of the paper, posted", price: "£38" },
    { item: "Corrected tide card", price: "£4.50" },
    { item: "Harbour chart reprint, 1907 survey", price: "£12" },
  ],
};
