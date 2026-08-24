import type { z } from "zod";
import type { splitHeroSchema } from "./SplitHero.schema";

export const splitHeroDefaults: z.infer<typeof splitHeroSchema> = {
  headline: "Low water opens the whole foreshore",
  body: "Two hours either side of the ebb you can walk from the harbour arm to the shingle bank without wetting a boot. The dispatches say when.",
  mediaSide: "end",
  image: {
    url: "/hero-pricing.svg",
    alt: "Three angled sails of colour above a dark baseline, standing in for the foreshore at low water",
  },
  cta: { label: "Check today's low water", href: "/dispatches/tide-tables" },
};
