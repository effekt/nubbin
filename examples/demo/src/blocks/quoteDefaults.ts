import type { z } from "zod";
import type { quoteSchema } from "./Quote.schema";

export const quoteDefaults: z.infer<typeof quoteSchema> = {
  text: "I stopped trusting the printed tide tables the spring they ran four minutes fast. I have not stopped trusting Bellwether once.",
  attribution: {
    name: "Edith Marsh",
    role: "Oyster skipper, Whitstable",
  },
  tone: "light",
};
