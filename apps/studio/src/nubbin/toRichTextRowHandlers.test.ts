import type { RichText } from "@nubbin/core";
import { expect, test, vi } from "vitest";
import { toRichTextRowHandlers } from "./toRichTextRowHandlers";

const doc: RichText = [
  { kind: "paragraph", spans: [{ text: "one" }, { text: "two", marks: ["strong"] }] },
  { kind: "listItem", spans: [{ text: "three" }] },
];

const wired = (index: number) => {
  const onChange = vi.fn();
  const onSelect = vi.fn();
  return { handlers: toRichTextRowHandlers(doc, index, onChange, onSelect), onChange, onSelect };
};

test("a kind change rewrites only that block", () => {
  const { handlers, onChange } = wired(1);
  handlers.onKind("paragraph");
  expect(onChange).toHaveBeenCalledWith([doc[0], { ...doc[1], kind: "paragraph" }]);
});

test("a span change folds through to the document", () => {
  const { handlers, onChange } = wired(0);
  handlers.onSpanChange(1, { text: "TWO", marks: ["strong"] });
  const next = onChange.mock.calls[0]?.[0] as RichText;
  expect(next[0]?.spans[1]).toEqual({ text: "TWO", marks: ["strong"] });
});

test("selecting a span names its block and span", () => {
  const { handlers, onSelect } = wired(1);
  handlers.onSelectSpan(0);
  expect(onSelect).toHaveBeenCalledWith({ block: 1, span: 0 });
});

test("the ops that move or remove what selection points at clear it first", () => {
  const { handlers, onSelect } = wired(0);
  handlers.onMove(0, 1);
  handlers.onRemove();
  handlers.onSpanRemove(0);
  expect(onSelect.mock.calls).toEqual([[undefined], [undefined], [undefined]]);
});

test("a paste folds through withPastedLines into new paragraphs", () => {
  const { handlers, onChange } = wired(0);
  handlers.onPaste(0, { start: 3, end: 3 }, ["one", "pasted"]);
  const next = onChange.mock.calls[0]?.[0] as RichText;
  expect(next).toHaveLength(3);
  expect(next[1]).toEqual({ kind: "paragraph", spans: [{ text: "pasted" }] });
});
