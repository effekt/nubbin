import type { z } from "zod";
import type { cardSchema } from "./Card.schema";

/** A real dispatch, not a placeholder: a freshly dropped card reads like the page it lands on.
 *
 * No badge. `new` and `updated` say something happened to this card, so a default carrying one
 * makes every card on a page claim it — and a mark that is on everything marks nothing. The
 * reference page passes a badge explicitly, which is where seeing the pill belongs. */
export const cardDefaults: z.infer<typeof cardSchema> = {
  title: "The herring fleet waits out a third day of fog",
  summary:
    "Nothing has left the harbour since Tuesday. We walked the quay at first light to ask the crews what a lost week costs, and what they do with one.",
  href: "/dispatches/fog-week",
  meta: "Dispatches · 12 March",
};
