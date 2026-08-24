import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RichTextSpanRow } from "./RichTextSpanRow";

function renderRow(overrides: Partial<Parameters<typeof RichTextSpanRow>[0]> = {}) {
  const handlers = {
    onSelect: vi.fn(),
    onChange: vi.fn(),
    onRemove: vi.fn(),
    onPaste: vi.fn(),
  };
  render(
    <RichTextSpanRow
      id="s0"
      span={{ text: "quiet water", marks: ["em"] }}
      readOnly={false}
      selected={false}
      {...handlers}
      {...overrides}
    />,
  );
  return handlers;
}

test("focusing the text selects the span; typing keeps its marks", () => {
  const handlers = renderRow();
  const input = screen.getByLabelText("Span text");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "quiet harbour" } });
  expect(handlers.onSelect).toHaveBeenCalled();
  expect(handlers.onChange).toHaveBeenCalledWith({ text: "quiet harbour", marks: ["em"] });
});

test("an unlinked span shows no target input; a linked one edits it", () => {
  renderRow();
  expect(screen.queryByLabelText("Link target")).toBeNull();
});

test("a single-line paste is left to the input itself", () => {
  const handlers = renderRow();
  fireEvent.paste(screen.getByLabelText("Span text"), {
    clipboardData: { getData: () => "one line only" },
  });
  expect(handlers.onPaste).not.toHaveBeenCalled();
});

test("a multi-line paste hands its folded lines up with the selection range", () => {
  const handlers = renderRow();
  const input = screen.getByLabelText("Span text");
  fireEvent.paste(input, { clipboardData: { getData: () => "first\nsecond" } });
  expect(handlers.onPaste).toHaveBeenCalledWith(expect.anything(), ["first", "second"]);
});

test("remove is a real button", () => {
  const handlers = renderRow();
  fireEvent.click(screen.getByRole("button", { name: "Remove span" }));
  expect(handlers.onRemove).toHaveBeenCalled();
});
