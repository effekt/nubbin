import { defineBlock } from "@nubbin/core";
import { AnnouncementBar } from "./AnnouncementBar";
import { announcementBarSchema } from "./AnnouncementBar.schema";

export const announcementBarBlock = defineBlock({
  name: "AnnouncementBar",
  description: "One line above everything: today's notice, optionally going somewhere.",
  icon: "banner",
  schema: announcementBarSchema,
  component: AnnouncementBar,
  version: 1,
  slots: {},
});
