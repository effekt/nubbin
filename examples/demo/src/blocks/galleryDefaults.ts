import type { z } from "zod";
import type { gallerySchema } from "./Gallery.schema";

export const galleryDefaults: z.infer<typeof gallerySchema> = {
  heading: "The estuary, in pictures",
  items: [
    {
      url: "/figures/harbour-arm.svg",
      alt: "The harbour arm curving out to its light",
      caption: "The eastern arm, before the repairs begin.",
    },
    {
      url: "/figures/oyster-beds.svg",
      alt: "Oyster trestles standing clear of the water at low tide",
      caption: "The beds show for an hour either side of low water.",
    },
    {
      url: "/figures/tide-gauge.svg",
      alt: "The tide gauge on the harbour wall, its marker sitting low",
      caption: "The gauge the corrected tables were read against.",
    },
  ],
  layout: "grid",
};
