import type { RichText } from "@nubbin/core";
import { expect, test } from "vitest";
import { withRichTextBlock } from "./withRichTextBlock";

const doc: RichText = [
  { kind: "paragraph", spans: [{ text: "one" }] },
  { kind: "listItem", spans: [{ text: "two" }] },
];

test("replaces one block and leaves its neighbours alone, as a new array", () => {
  const next = withRichTextBlock(doc, 1, { kind: "paragraph", spans: [{ text: "changed" }] });
  expect(next[0]).toBe(doc[0]);
  expect(next[1]).toEqual({ kind: "paragraph", spans: [{ text: "changed" }] });
  expect(doc[1]?.spans[0]?.text).toBe("two");
});

test("an index off the end changes nothing", () => {
  expect(withRichTextBlock(doc, 5, { kind: "paragraph", spans: [] })).toEqual(doc);
});
