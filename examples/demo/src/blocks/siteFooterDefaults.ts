import type { z } from "zod";
import type { siteFooterSchema } from "./SiteFooter.schema";

export const siteFooterDefaults: z.infer<typeof siteFooterSchema> = {
  tagline: "Dispatches from three miles of shoreline, filed by six each morning.",
  tone: "dark",
  columns: [
    {
      heading: "Read",
      links: [
        { label: "Dispatches", href: "/dispatches" },
        { label: "On now", href: "/live" },
        { label: "Tide tables", href: "/dispatches/tide-tables" },
      ],
    },
    {
      heading: "The paper",
      links: [
        { label: "Who writes this", href: "/#" },
        { label: "Corrections", href: "/#" },
        { label: "Contact", href: "/#" },
      ],
    },
    {
      heading: "Elsewhere",
      links: [
        { label: "Harbour office", href: "/#" },
        { label: "Lifeboat station", href: "/#" },
        { label: "Bird reserve", href: "/#" },
      ],
    },
  ],
  legal: "© 2026 Bellwether. Printed when the tide allows.",
};
