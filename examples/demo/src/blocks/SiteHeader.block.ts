import { defineBlock } from "@nubbin/core";
import { SiteHeader } from "./SiteHeader";
import { siteHeaderSchema } from "./SiteHeader.schema";

export const siteHeaderBlock = defineBlock({
  name: "SiteHeader",
  description: "The top of every page: the paper's name and where the paper goes.",
  icon: "masthead",
  category: "Navigation",
  schema: siteHeaderSchema,
  component: SiteHeader,
  version: 1,
  slots: {},
});
