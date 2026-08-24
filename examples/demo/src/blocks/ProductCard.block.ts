import { defineBlock } from "@nubbin/core";
import { ProductCard } from "./ProductCard";
import { productCardSchema } from "./ProductCard.schema";

/** The price is a string on purpose: currency formatting is content the author writes, and
 * a number the site could sum is the start of a checkout this paper does not run. */
export const productCardBlock = defineBlock({
  name: "ProductCard",
  description: "One thing the paper sells: name, price as printed, and a line about it.",
  icon: "tag",
  category: "Commerce",
  schema: productCardSchema,
  component: ProductCard,
  version: 1,
  slots: {},
});
