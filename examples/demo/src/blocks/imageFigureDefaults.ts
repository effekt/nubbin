import type { z } from "zod";
import type { imageFigureSchema } from "./ImageFigure.schema";

export const imageFigureDefaults: z.infer<typeof imageFigureSchema> = {
  image: {
    url: "/figures/foreshore.svg",
    alt: "The foreshore at low water, groynes running out to a thin line of sea",
  },
  caption:
    "Two hours either side of the ebb, the walk from the harbour arm to the shingle bank runs dry the whole way.",
  credit: "Drawn for the paper",
  width: "text",
};
