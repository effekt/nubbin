import { defineBlock } from "@nubbin/core";
import { SiteFooter } from "./SiteFooter";
import { siteFooterSchema } from "./SiteFooter.schema";

export const siteFooterBlock = defineBlock({
  name: "SiteFooter",
  description: "The end of every page: tagline, link columns and the legal line.",
  icon: "footer",
  category: "Navigation",
  schema: siteFooterSchema,
  component: SiteFooter,
  version: 1,
  slots: {},
});
