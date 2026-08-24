import type { RichText } from "@nubbin/core";
import { expect, test } from "vitest";
import { withRichTextSpan } from "./withRichTextSpan";

const doc: RichText = [
  { kind: "paragraph", spans: [{ text: "a" }, { text: "b", marks: ["em"] }] },
  { kind: "listItem", spans: [{ text: "c" }] },
];

test("replaces one span of one block and nothing else", () => {
  const next = withRichTextSpan(doc, 0, 1, { text: "B", marks: ["strong"] });
  expect(next[0]?.spans).toEqual([{ text: "a" }, { text: "B", marks: ["strong"] }]);
  expect(next[1]).toBe(doc[1]);
});

test("a missing block changes nothing", () => {
  expect(withRichTextSpan(doc, 9, 0, { text: "x" })).toBe(doc);
});
