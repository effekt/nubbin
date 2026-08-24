import { type RichTextSpan, richText } from "@nubbin/core";
import { expect, test } from "vitest";
import { withSpanMarkToggled } from "./withSpanMarkToggled";

test("toggling a mark on adds it; toggling it off removes it — twice is identity", () => {
  const span: RichTextSpan = { text: "loud" };
  const marked = withSpanMarkToggled(span, "strong");
  expect(marked).toEqual({ text: "loud", marks: ["strong"] });
  expect(withSpanMarkToggled(marked, "strong")).toEqual(span);
});

test("marks keep core's own order however they were toggled", () => {
  const forward = withSpanMarkToggled(withSpanMarkToggled({ text: "x" }, "strong"), "em");
  const backward = withSpanMarkToggled(withSpanMarkToggled({ text: "x" }, "em"), "strong");
  expect(forward.marks).toEqual(["strong", "em"]);
  expect(backward.marks).toEqual(["strong", "em"]);
});

test("the last mark leaving drops the key rather than keeping an empty array", () => {
  const span = withSpanMarkToggled({ text: "x", marks: ["code"], href: "/y" }, "code");
  expect("marks" in span).toBe(false);
  expect(span.href).toBe("/y");
});

test("every toggle yields a span the schema accepts", () => {
  const validate = richText()["~standard"].validate;
  const span = withSpanMarkToggled(withSpanMarkToggled({ text: "x" }, "code"), "em");
  expect(validate([{ kind: "paragraph", spans: [span] }]).issues).toBeUndefined();
});
