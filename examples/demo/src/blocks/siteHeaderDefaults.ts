import type { z } from "zod";
import type { siteHeaderSchema } from "./SiteHeader.schema";

export const siteHeaderDefaults: z.infer<typeof siteHeaderSchema> = {
  brand: "Bellwether",
  tone: "light",
  links: [
    { label: "Dispatches", href: "/dispatches" },
    { label: "On now", href: "/live" },
    { label: "Chandlery", href: "/chandlery" },
  ],
};
