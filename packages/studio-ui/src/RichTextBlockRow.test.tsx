import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RichTextBlockRow } from "./RichTextBlockRow";

function renderRow() {
  const handlers = {
    onKind: vi.fn(),
    onMove: vi.fn(),
    onRemove: vi.fn(),
    onSelectSpan: vi.fn(),
    onSpanChange: vi.fn(),
    onSpanRemove: vi.fn(),
    onSpanAdd: vi.fn(),
    onPaste: vi.fn(),
  };
  render(
    <ol>
      <RichTextBlockRow
        id="b1"
        block={{ kind: "listItem", spans: [{ text: "a berth" }] }}
        index={1}
        count={3}
        readOnly={false}
        selectedSpan={undefined}
        {...handlers}
      />
    </ol>,
  );
  return handlers;
}

test("the kind edits as a segmented group over core's closed set", () => {
  const handlers = renderRow();
  const group = screen.getByRole("group", { name: "Kind" });
  expect(group).toBeDefined();
  expect(screen.getByRole("radio", { name: "listItem" })).toHaveProperty("checked", true);
  fireEvent.click(screen.getByRole("radio", { name: "paragraph" }));
  expect(handlers.onKind).toHaveBeenCalledWith("paragraph");
});

test("the row carries the block's id and hands its spans the spans segment", () => {
  renderRow();
  expect(screen.getByRole("listitem").id).toBe("b1");
  expect(screen.getByLabelText("Span text").id).toBe("b1_spans_0_text");
});

test("the block moves and removes by the repeater's own buttons", () => {
  const handlers = renderRow();
  fireEvent.click(screen.getByRole("button", { name: "Move row up" }));
  expect(handlers.onMove).toHaveBeenCalledWith(1, 0);
  fireEvent.click(screen.getByRole("button", { name: "Remove row" }));
  expect(handlers.onRemove).toHaveBeenCalled();
});
