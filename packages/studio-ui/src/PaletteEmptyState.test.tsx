import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PaletteEmptyState } from "./PaletteEmptyState";

test("names the query that matched nothing", () => {
  render(<PaletteEmptyState query="carousel" onClear={() => undefined} />);
  expect(screen.getByText(/No blocks match “carousel”/)).toBeDefined();
});

test("offers clearing the search as a real button", () => {
  const onClear = vi.fn();
  render(<PaletteEmptyState query="carousel" onClear={onClear} />);
  const button = screen.getByRole("button", { name: "Clear search" });
  expect(button.tagName).toBe("BUTTON");
  fireEvent.click(button);
  expect(onClear).toHaveBeenCalledOnce();
});
