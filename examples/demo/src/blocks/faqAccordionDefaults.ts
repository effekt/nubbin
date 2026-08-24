import type { z } from "zod";
import type { faqAccordionSchema } from "./FaqAccordion.schema";

export const faqAccordionDefaults: z.infer<typeof faqAccordionSchema> = {
  heading: "Questions the harbour office gets asked",
  tone: "light",
  items: [
    {
      question: "Where do the tide times come from?",
      answer:
        "The admiralty tables, corrected against the gauge on the harbour wall. Where the two disagree we print the gauge and say so.",
    },
    {
      question: "How early is the morning dispatch filed?",
      answer:
        "By six, most days. A dispatch filed after the boats are in is marked as a late edition rather than backdated.",
    },
    {
      question: "Do you cover the whole estuary?",
      answer:
        "Three miles of it, on foot. Anything past the point comes from the lifeboat station or the reserve wardens, and is credited to them.",
    },
    {
      question: "What happens when something we printed turns out to be wrong?",
      answer:
        "It is corrected on the page and listed in the changes feed with the time it moved. Nothing is quietly rewritten.",
    },
  ],
};
