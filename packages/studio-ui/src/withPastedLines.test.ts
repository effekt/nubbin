import type { RichText } from "@nubbin/core";
import { richText } from "@nubbin/core";
import { expect, test } from "vitest";
import { withPastedLines } from "./withPastedLines";

const doc: RichText = [
  { kind: "paragraph", spans: [{ text: "before after", marks: ["em"] }] },
  { kind: "listItem", spans: [{ text: "tail" }] },
];

test("the first line lands in the span's selection; the rest become paragraphs after it", () => {
  const next = withPastedLines(doc, 0, 0, { start: 7, end: 7 }, ["one", "two", "three"]);
  expect(next[0]?.spans).toEqual([{ text: "before oneafter", marks: ["em"] }]);
  expect(next[1]).toEqual({ kind: "paragraph", spans: [{ text: "two" }] });
  expect(next[2]).toEqual({ kind: "paragraph", spans: [{ text: "three" }] });
  expect(next[3]).toBe(doc[1]);
  expect(richText()["~standard"].validate(next).issues).toBeUndefined();
});

test("a selection is replaced, not appended to", () => {
  const next = withPastedLines(doc, 0, 0, { start: 0, end: 6 }, ["instead"]);
  expect(next[0]?.spans[0]?.text).toBe("instead after");
  expect(next).toHaveLength(2);
});

test("no lines or a missing span changes nothing", () => {
  expect(withPastedLines(doc, 0, 0, { start: 0, end: 0 }, [])).toBe(doc);
  expect(withPastedLines(doc, 5, 0, { start: 0, end: 0 }, ["x"])).toBe(doc);
});
