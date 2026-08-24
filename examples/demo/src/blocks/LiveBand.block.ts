import { defineBlock } from "@nubbin/core";
import { LiveBand } from "./LiveBand";
import { liveBandSchema } from "./LiveBand.schema";

export const liveBandBlock = defineBlock({
  name: "LiveBand",
  schema: liveBandSchema,
  component: LiveBand,
  version: 1,
  slots: {},
});
