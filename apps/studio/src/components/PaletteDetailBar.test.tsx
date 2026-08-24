import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PaletteDetailBar } from "./PaletteDetailBar";

test("hints at what it is for while nothing is pointed at", () => {
  render(<PaletteDetailBar block={undefined} />);
  expect(screen.getByText("Hover a block to see what it is for.")).toBeDefined();
});

test("reads the pointed-at block's name and description, as a polite live region", () => {
  const { container } = render(
    <PaletteDetailBar
      block={{ name: "UpdateFeed", description: "The record of recent changes, newest first." }}
    />,
  );
  const bar = container.querySelector("[aria-live='polite']");
  expect(bar?.textContent).toBe("UpdateFeed — The record of recent changes, newest first.");
});

test("shows the name alone when a block carries no description", () => {
  const { container } = render(<PaletteDetailBar block={{ name: "Hero" }} />);
  expect(container.querySelector("[aria-live='polite']")?.textContent).toBe("Hero");
});
