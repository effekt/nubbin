import { defineBlock } from "@nubbin/core";
import { PageHeader } from "./PageHeader";
import { pageHeaderSchema } from "./PageHeader.schema";

export const pageHeaderBlock = defineBlock({
  name: "PageHeader",
  description: "Opens an interior page with eyebrow, headline and standfirst, no action.",
  icon: "header",
  schema: pageHeaderSchema,
  component: PageHeader,
  version: 1,
  slots: {},
});
