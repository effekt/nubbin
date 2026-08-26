import type { RichText } from "@nubbin/core";
import { expect, test } from "vitest";
import { asRichTextValue } from "./asRichTextValue";

/** Real prose in every shape the model has: marks, a link, a list, an empty block. */
const doc: RichText = [
  {
    kind: "paragraph",
    spans: [
      { text: "The slipway closes " },
      { text: "an hour before", marks: ["strong", "em"] },
      { text: " the printed low." },
    ],
  },
  { kind: "listItem", spans: [{ text: "check the board", marks: ["code"] }] },
  { kind: "listItem", spans: [{ text: "the harbour office", href: "/office" }] },
  { kind: "paragraph", spans: [] },
];

test("a valid document round-trips as itself — the control renders the value it was given", () => {
  expect(asRichTextValue(doc)).toEqual(doc);
});

test("undefined reads as the empty document a fresh field holds", () => {
  expect(asRichTextValue(undefined)).toEqual([]);
});

test.each([
  ["a string of markup", "<p>hello</p>"],
  ["a string inside the array", ["just a sentence"]],
  ["an unknown kind", [{ kind: "heading", spans: [] }]],
  ["an unknown mark", [{ kind: "paragraph", spans: [{ text: "x", marks: ["blink"] }] }]],
  ["a stray key", [{ kind: "paragraph", spans: [{ text: "x", style: "red" }] }]],
])("%s is not rich text and comes back undefined", (_what, value) => {
  expect(asRichTextValue(value)).toBeUndefined();
});
