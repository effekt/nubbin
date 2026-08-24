import type { InferProps } from "@nubbin/core";
import type { proseSchema } from "./Prose.schema";

export const proseDefaults: InferProps<typeof proseSchema> = {
  heading: "Four minutes fast, all spring",
  tone: "light",
  body: [
    {
      kind: "paragraph",
      spans: [
        {
          text: "The printed table has run four minutes ahead of the water since March. Four minutes is nothing on a beach and a great deal on a slipway, which is why the oyster boats noticed and nobody else did.",
        },
      ],
    },
    {
      kind: "paragraph",
      spans: [
        {
          text: "The corrected set is below. The ferry reads the same table, so the crossing times on ",
        },
        { text: "the dispatches page", href: "/dispatches" },
        { text: " have moved with it." },
      ],
    },
  ],
};
