import { defineBlock } from "@nubbin/core";
import { PriceList } from "./PriceList";
import { priceListSchema } from "./PriceList.schema";

export const priceListBlock = defineBlock({
  name: "PriceList",
  description: "The chandlery's price board: items down one side, prices down the other.",
  icon: "pricelist",
  category: "Commerce",
  schema: priceListSchema,
  component: PriceList,
  version: 1,
  slots: {},
});
