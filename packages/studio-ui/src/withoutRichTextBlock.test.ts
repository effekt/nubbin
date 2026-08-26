import type { RichText } from "@nubbin/core";
import { expect, test } from "vitest";
import { withoutRichTextBlock } from "./withoutRichTextBlock";

const doc: RichText = [
  { kind: "paragraph", spans: [{ text: "one" }] },
  { kind: "listItem", spans: [{ text: "two" }] },
];

test("removes one block by index", () => {
  expect(withoutRichTextBlock(doc, 0)).toEqual([doc[1]]);
});

test("removing the only block leaves the valid empty document", () => {
  expect(withoutRichTextBlock([doc[0] ?? { kind: "paragraph", spans: [] }], 0)).toEqual([]);
});
