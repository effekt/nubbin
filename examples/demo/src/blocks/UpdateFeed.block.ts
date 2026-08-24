import { defineBlock } from "@nubbin/core";
import { UpdateFeed } from "./UpdateFeed";
import { updateFeedSchema } from "./UpdateFeed.schema";

export const updateFeedBlock = defineBlock({
  name: "UpdateFeed",
  description: "The record of recent changes, newest first, resolved on each request.",
  icon: "📰",
  schema: updateFeedSchema,
  component: UpdateFeed,
  version: 1,
  slots: {},
});
