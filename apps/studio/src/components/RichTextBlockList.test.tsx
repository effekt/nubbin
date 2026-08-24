import type { RichText } from "@nubbin/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RichTextBlockList } from "./RichTextBlockList";

const doc: RichText = [
  { kind: "paragraph", spans: [{ text: "one" }] },
  { kind: "paragraph", spans: [{ text: "two" }] },
];

test("moving a block by its buttons reorders the document and clears the selection", () => {
  const onChange = vi.fn();
  const onSelect = vi.fn();
  render(
    <RichTextBlockList
      id="body"
      doc={doc}
      readOnly={false}
      selection={{ block: 0, span: 0 }}
      onSelect={onSelect}
      onChange={onChange}
    />,
  );
  expect(screen.getAllByLabelText("Span text")).toHaveLength(2);
  fireEvent.click(screen.getAllByRole("button", { name: "Move row down" })[0] as HTMLElement);
  expect(onChange).toHaveBeenCalledWith([doc[1], doc[0]]);
  expect(onSelect).toHaveBeenCalledWith(undefined);
});
