import { defineBlock } from "@nubbin/core";
import { UpdateFeed } from "./UpdateFeed";
import { updateFeedSchema } from "./UpdateFeed.schema";

export const updateFeedBlock = defineBlock({
  name: "UpdateFeed",
  schema: updateFeedSchema,
  component: UpdateFeed,
  version: 1,
  slots: {},
});
