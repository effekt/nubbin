import type { RichText } from "@nubbin/core";
import { richText } from "@nubbin/core";
import { expect, test } from "vitest";
import { withoutRichTextSpan } from "./withoutRichTextSpan";

const doc: RichText = [{ kind: "paragraph", spans: [{ text: "a" }, { text: "b" }] }];

test("removes one span from one block", () => {
  expect(withoutRichTextSpan(doc, 0, 0)[0]?.spans).toEqual([{ text: "b" }]);
});

test("removing the last span leaves a block with none, which the schema allows", () => {
  const next = withoutRichTextSpan(withoutRichTextSpan(doc, 0, 0), 0, 0);
  expect(next[0]?.spans).toEqual([]);
  expect(richText()["~standard"].validate(next).issues).toBeUndefined();
});

test("a missing block changes nothing", () => {
  expect(withoutRichTextSpan(doc, 4, 0)).toBe(doc);
});
