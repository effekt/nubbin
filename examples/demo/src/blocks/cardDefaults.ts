import type { z } from "zod";
import type { cardSchema } from "./Card.schema";

/** A real dispatch, not a placeholder: a freshly dropped card should read like the page it
 * lands on, badge showing, so an editor sees at once what the pill is for. */
export const cardDefaults: z.infer<typeof cardSchema> = {
  title: "The herring fleet waits out a third day of fog",
  summary:
    "Nothing has left the harbour since Tuesday. We walked the quay at first light to ask the crews what a lost week costs, and what they do with one.",
  href: "/dispatches/fog-week",
  meta: "Dispatches · 12 March",
  badge: "new",
};
