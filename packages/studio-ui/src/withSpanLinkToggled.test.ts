import type { RichTextSpan } from "@nubbin/core";
import { expect, test } from "vitest";
import { withSpanLinkToggled } from "./withSpanLinkToggled";

test("an unlinked span gains an empty target for the author to fill", () => {
  expect(withSpanLinkToggled({ text: "here" })).toEqual({ text: "here", href: "" });
});

test("a linked span drops the key entirely — toggling twice is identity", () => {
  const span: RichTextSpan = { text: "here", marks: ["em"] };
  const toggled = withSpanLinkToggled(withSpanLinkToggled(span));
  expect("href" in toggled).toBe(false);
  expect(toggled).toEqual(span);
});
