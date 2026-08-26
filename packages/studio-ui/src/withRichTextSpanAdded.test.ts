import type { RichText } from "@nubbin/core";
import { expect, test } from "vitest";
import { withRichTextSpanAdded } from "./withRichTextSpanAdded";

const doc: RichText = [{ kind: "paragraph", spans: [{ text: "a" }, { text: "b" }] }];

test("inserts an empty span after the given index", () => {
  const next = withRichTextSpanAdded(doc, 0, 0);
  expect(next[0]?.spans).toEqual([{ text: "a" }, { text: "" }, { text: "b" }]);
});

test("after the last index appends at the end", () => {
  const next = withRichTextSpanAdded(doc, 0, 1);
  expect(next[0]?.spans).toEqual([{ text: "a" }, { text: "b" }, { text: "" }]);
});

test("a missing block changes nothing", () => {
  expect(withRichTextSpanAdded(doc, 3, 0)).toBe(doc);
});
