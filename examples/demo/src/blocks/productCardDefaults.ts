import type { z } from "zod";
import type { productCardSchema } from "./ProductCard.schema";

/** A real item off the chandlery shelf, not a placeholder: a freshly dropped card reads
 * like the page it lands on.
 *
 * No badge, and no image. The marks say something happened to this item, so a default
 * carrying one makes every card on a page claim it; the fixture passes both explicitly,
 * which is where seeing them belongs. */
export const productCardDefaults: z.infer<typeof productCardSchema> = {
  name: "Corrected tide tables, spring edition",
  price: "£4.50",
  description:
    "The table the paper corrected in March, printed on card that survives a wet pocket. Covers the harbour arm to the shingle bank.",
  href: "/dispatches/tide-tables",
};
