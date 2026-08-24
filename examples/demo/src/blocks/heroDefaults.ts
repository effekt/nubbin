import type { z } from "zod";
import type { heroSchema } from "./Hero.schema";

export const heroDefaults: z.infer<typeof heroSchema> = {
  eyebrow: "Read the estuary before you read the forecast",
  headline: "The water tells you first",
  body: "Bellwether walks the same three miles of shoreline every morning and writes down what changed — tides, wind, the ferry, the birds on the shingle.",
  tone: "dark",
  cta: { label: "Read this morning's dispatches", href: "/dispatches" },
  image: {
    url: "/hero-board.svg",
    alt: "Three panels of colour blocks, standing in for a chalked tide board",
  },
};
