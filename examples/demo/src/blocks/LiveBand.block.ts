import { defineBlock } from "@nubbin/core";
import { LiveBand } from "./LiveBand";
import { liveBandSchema } from "./LiveBand.schema";

export const liveBandBlock = defineBlock({
  name: "LiveBand",
  description:
    "A strip of what is happening right now, resolved on each request rather than frozen at publish.",
  icon: "🔴",
  schema: liveBandSchema,
  component: LiveBand,
  version: 1,
  slots: {},
});
