import { defineBlock } from "@nubbin/core";
import { ProductGrid } from "./ProductGrid";
import { productGridSchema } from "./ProductGrid.schema";

/** Declares `Commerce` although it carries a slot: the palette's derived fallback would
 * file any slotted block under Layout, and an author looking for the shelf looks under
 * what it sells, not how it is built. */
export const productGridBlock = defineBlock({
  name: "ProductGrid",
  description: "A shelf of ProductCards, three across, with an optional heading.",
  icon: "grid",
  category: "Commerce",
  schema: productGridSchema,
  component: ProductGrid,
  version: 1,
  slots: { products: { allow: ["ProductCard"], min: 1, max: 8 } },
});
