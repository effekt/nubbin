import type { RichText } from "@nubbin/core";
import { richText } from "@nubbin/core";
import { expect, test } from "vitest";
import { withRichTextBlockAdded } from "./withRichTextBlockAdded";

test("appends a block of the asked kind holding one empty span, and the schema accepts it", () => {
  const doc: RichText = [{ kind: "paragraph", spans: [{ text: "before" }] }];
  const next = withRichTextBlockAdded(doc, "listItem");
  expect(next).toHaveLength(2);
  expect(next[1]).toEqual({ kind: "listItem", spans: [{ text: "" }] });
  expect(richText()["~standard"].validate(next).issues).toBeUndefined();
});

test("grows the empty document", () => {
  expect(withRichTextBlockAdded([], "paragraph")).toEqual([
    { kind: "paragraph", spans: [{ text: "" }] },
  ]);
});
