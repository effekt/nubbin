import type { z } from "zod";
import type { featureGridSchema } from "./FeatureGrid.schema";

export const featureGridDefaults: z.infer<typeof featureGridSchema> = {
  heading: "What gets written down",
  tone: "light",
  items: [
    {
      icon: "chart",
      title: "Tides, against the gauge",
      body: "High and low water for the harbour, checked against the wall gauge rather than reprinted from the table.",
    },
    {
      icon: "shield",
      title: "What the water is doing now",
      body: "Swell, wind over tide, and where the fog stops — the things a table cannot tell you an hour ahead.",
    },
    {
      icon: "bolt",
      title: "Crossings and closures",
      body: "The ferry, the slipway, and which arm of the wall is roped off this week.",
    },
    {
      icon: "layers",
      title: "The shoreline itself",
      body: "Terns on the shingle, seals on the bar, and the weeks each of them arrives or leaves.",
    },
  ],
};
