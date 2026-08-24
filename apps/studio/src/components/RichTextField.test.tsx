import type { FieldNode, RichText } from "@nubbin/core";
import { richText } from "@nubbin/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RichTextField } from "./RichTextField";

const fieldNode: FieldNode = { path: "body", kind: "array", optional: false };

/** Real prose in every shape the model has: plain runs, marks, a link, a list item. */
const doc: RichText = [
  {
    kind: "paragraph",
    spans: [
      { text: "The corrected table is " },
      { text: "final", marks: ["strong"] },
      { text: " as of Friday." },
    ],
  },
  { kind: "listItem", spans: [{ text: "the harbour office", href: "/office" }] },
];

function renderField(value: unknown, onChange: (next: unknown) => void = () => 0) {
  return render(
    <RichTextField
      id="body"
      label="body"
      field={fieldNode}
      value={value}
      readOnly={false}
      onChange={onChange}
    />,
  );
}

test("renders every span's text editable and commits nothing it was not asked to", () => {
  const onChange = vi.fn();
  renderField(doc, onChange);
  const texts = screen.getAllByLabelText("Span text").map((i) => (i as HTMLInputElement).value);
  expect(texts).toEqual([
    "The corrected table is ",
    "final",
    " as of Friday.",
    "the harbour office",
  ]);
  expect(onChange).not.toHaveBeenCalled();
});

test("focusing a span tells the toolbar the truth about its marks and link", () => {
  renderField(doc);
  fireEvent.focus(screen.getByDisplayValue("final"));
  expect(screen.getByRole("button", { name: "strong" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "em" }).getAttribute("aria-pressed")).toBe("false");
  fireEvent.focus(screen.getByDisplayValue("the harbour office"));
  expect(screen.getByRole("button", { name: "strong" }).getAttribute("aria-pressed")).toBe("false");
  expect(screen.getByRole("button", { name: "link" }).getAttribute("aria-pressed")).toBe("true");
});

test("a mark toggle commits the typed structure, and the schema accepts it", () => {
  const onChange = vi.fn();
  renderField(doc, onChange);
  fireEvent.focus(screen.getAllByLabelText("Span text")[2] as HTMLElement);
  fireEvent.click(screen.getByRole("button", { name: "em" }));
  const next = onChange.mock.calls[0]?.[0] as RichText;
  expect(next[0]?.spans[2]).toEqual({ text: " as of Friday.", marks: ["em"] });
  expect(richText()["~standard"].validate(next).issues).toBeUndefined();
});

test("the link toggle seats an empty target on the selected span", () => {
  const onChange = vi.fn();
  renderField(doc, onChange);
  fireEvent.focus(screen.getByDisplayValue("final"));
  fireEvent.click(screen.getByRole("button", { name: "link" }));
  const next = onChange.mock.calls[0]?.[0] as RichText;
  expect(next[0]?.spans[1]).toEqual({ text: "final", marks: ["strong"], href: "" });
});

test("typing in a span folds to the same document with that text changed", () => {
  const onChange = vi.fn();
  renderField(doc, onChange);
  fireEvent.change(screen.getByDisplayValue("final"), { target: { value: "settled" } });
  const next = onChange.mock.calls[0]?.[0] as RichText;
  expect(next[0]?.spans[1]).toEqual({ text: "settled", marks: ["strong"] });
  expect(next[1]).toEqual(doc[1]);
});

test("a linked span shows its target for editing", () => {
  const onChange = vi.fn();
  renderField(doc, onChange);
  const href = screen.getByLabelText("Link target") as HTMLInputElement;
  expect(href.value).toBe("/office");
  fireEvent.change(href, { target: { value: "/harbour" } });
  const next = onChange.mock.calls[0]?.[0] as RichText;
  expect(next[1]?.spans[0]?.href).toBe("/harbour");
});

test("each add button appends its own kind, holding one empty span", () => {
  const onChange = vi.fn();
  renderField(doc, onChange);
  fireEvent.click(screen.getByRole("button", { name: "Add list item" }));
  const next = onChange.mock.calls[0]?.[0] as RichText;
  expect(next[2]).toEqual({ kind: "listItem", spans: [{ text: "" }] });
});

test("a block's kind edits through the segmented control over core's closed set", () => {
  const onChange = vi.fn();
  renderField(doc, onChange);
  const groups = screen.getAllByRole("group", { name: "Kind" });
  expect(groups).toHaveLength(2);
  fireEvent.click(screen.getAllByRole("radio", { name: "paragraph" })[1] as HTMLElement);
  const next = onChange.mock.calls[0]?.[0] as RichText;
  expect(next[1]?.kind).toBe("paragraph");
});

test("a multi-line paste folds to typed paragraphs; markup on the clipboard never lands", () => {
  const onChange = vi.fn();
  renderField(doc, onChange);
  fireEvent.paste(screen.getByDisplayValue("the harbour office"), {
    clipboardData: {
      getData: (type: string) =>
        type === "text/plain" ? "bold words\nsecond line" : "<b>bold words</b><p>second line</p>",
    },
  });
  const next = onChange.mock.calls[0]?.[0] as RichText;
  expect(next).toHaveLength(3);
  expect(next[2]).toEqual({ kind: "paragraph", spans: [{ text: "second line" }] });
  expect(JSON.stringify(next)).not.toContain("<");
  expect(richText()["~standard"].validate(next).issues).toBeUndefined();
});

test("an undefined value is the empty document, ready to grow", () => {
  const onChange = vi.fn();
  renderField(undefined, onChange);
  fireEvent.click(screen.getByRole("button", { name: "Add paragraph" }));
  expect(onChange).toHaveBeenCalledWith([{ kind: "paragraph", spans: [{ text: "" }] }]);
});

test("a value that is not rich text shows read-only as it was found", () => {
  renderField("<p>markup in a string</p>");
  expect(screen.getByText("array — read-only")).toBeDefined();
  expect(screen.queryByRole("toolbar")).toBeNull();
});
