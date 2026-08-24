import type { z } from "zod";
import type { announcementBarSchema } from "./AnnouncementBar.schema";

export const announcementBarDefaults: z.infer<typeof announcementBarSchema> = {
  text: "Wall repairs from Monday — the eastern harbour arm closes to walkers for six weeks",
  href: "/dispatches",
  tone: "notice",
};
