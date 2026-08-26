import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RichTextSpanList } from "./RichTextSpanList";

function renderList(selectedSpan?: number) {
  const handlers = {
    onSelectSpan: vi.fn(),
    onSpanChange: vi.fn(),
    onSpanRemove: vi.fn(),
    onSpanAdd: vi.fn(),
    onPaste: vi.fn(),
  };
  render(
    <RichTextSpanList
      id="b0"
      spans={[{ text: "first" }, { text: "second", marks: ["code"] }]}
      readOnly={false}
      selectedSpan={selectedSpan}
      {...handlers}
    />,
  );
  return handlers;
}

test("renders each span in order and adds a fresh one at the end", () => {
  const handlers = renderList();
  expect(screen.getAllByLabelText("Span text")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: "Add span" }));
  expect(handlers.onSpanAdd).toHaveBeenCalledWith(1);
});

test("a change or removal names the span it came from", () => {
  const handlers = renderList();
  fireEvent.change(screen.getByDisplayValue("second"), { target: { value: "changed" } });
  expect(handlers.onSpanChange).toHaveBeenCalledWith(1, { text: "changed", marks: ["code"] });
  fireEvent.click(screen.getAllByRole("button", { name: "Remove span" })[0] as HTMLElement);
  expect(handlers.onSpanRemove).toHaveBeenCalledWith(0);
});
