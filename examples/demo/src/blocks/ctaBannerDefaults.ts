import type { z } from "zod";
import type { ctaBannerSchema } from "./CtaBanner.schema";

export const ctaBannerDefaults: z.infer<typeof ctaBannerSchema> = {
  heading: "The morning read, before the boats go out",
  body: "One dispatch a day, filed by six. Corrections reach the page the moment we know about them.",
  tone: "dark",
  cta: { label: "See what changed today", href: "/live" },
};
