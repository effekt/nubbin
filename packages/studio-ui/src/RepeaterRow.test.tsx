import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RepeaterRow } from "./RepeaterRow";

function renderRow(
  label: string | undefined,
  onMove: (from: number, to: number) => void = vi.fn(),
) {
  return render(
    <ul>
      <RepeaterRow
        label={label}
        index={1}
        count={3}
        readOnly={false}
        onMove={onMove}
        onRemove={() => undefined}
      >
        <p>row body</p>
      </RepeaterRow>
    </ul>,
  );
}

test("the disclosure carries the row's label and opens its body", () => {
  renderRow("Fast shipping");
  const disclose = screen.getByRole("button", { name: "Fast shipping" });
  expect(disclose.getAttribute("aria-expanded")).toBe("false");
  expect(screen.queryByText("row body")).toBeNull();
  fireEvent.click(disclose);
  expect(disclose.getAttribute("aria-expanded")).toBe("true");
  expect(screen.getByText("row body")).toBeDefined();
});

test("an unlabelled row says untitled in a glyph and words, not a hue", () => {
  renderRow(undefined);
  expect(screen.getByText("(untitled)")).toBeDefined();
  expect(screen.getByRole("button", { name: "(untitled)" })).toBeDefined();
});

test("a drop hands the dragged index to onMove", () => {
  const onMove = vi.fn();
  renderRow("target", onMove);
  const row = screen.getByRole("listitem");
  fireEvent.drop(row, { dataTransfer: { getData: () => "0" } });
  expect(onMove).toHaveBeenCalledWith(0, 1);
});
