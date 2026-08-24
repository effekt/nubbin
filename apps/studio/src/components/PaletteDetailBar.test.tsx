import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PaletteDetailBar } from "./PaletteDetailBar";

test("always shows the same fixed instructional line, pointed at a block or not", () => {
  const { rerender } = render(<PaletteDetailBar block={undefined} />);
  const hint = "Drag a block in, or press Enter to add it at the selection.";
  expect(screen.getByText(hint)).toBeDefined();
  rerender(<PaletteDetailBar block={{ name: "Hero", description: "The opening statement." }} />);
  // The visible strip must not change with the pointer — the list above would shift.
  expect(screen.getByText(hint)).toBeDefined();
});

test("reads the pointed-at block's name and description to assistive tech only", () => {
  const { container } = render(
    <PaletteDetailBar
      block={{ name: "UpdateFeed", description: "The record of recent changes, newest first." }}
    />,
  );
  const live = container.querySelector("[aria-live='polite']");
  expect(live?.textContent).toBe("UpdateFeed — The record of recent changes, newest first.");
  expect(live?.className).toBe("nb-palette-detail-live");
});

test("announces the name alone when a block carries no description", () => {
  const { container } = render(<PaletteDetailBar block={{ name: "Hero" }} />);
  expect(container.querySelector("[aria-live='polite']")?.textContent).toBe("Hero");
});

test("announces nothing while nothing is pointed at", () => {
  const { container } = render(<PaletteDetailBar block={undefined} />);
  expect(container.querySelector("[aria-live='polite']")?.textContent).toBe("");
});
