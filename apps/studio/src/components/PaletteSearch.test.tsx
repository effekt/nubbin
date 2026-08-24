import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PaletteSearch } from "./PaletteSearch";

test("is a labelled search input with the design's placeholder", () => {
  render(<PaletteSearch query="" onChange={() => undefined} />);
  const input = screen.getByRole("searchbox", { name: "Search blocks" });
  expect(input.getAttribute("placeholder")).toBe("Search blocks…");
});

test("reports every keystroke to the caller", () => {
  const onChange = vi.fn();
  render(<PaletteSearch query="" onChange={onChange} />);
  fireEvent.change(screen.getByRole("searchbox", { name: "Search blocks" }), {
    target: { value: "hero" },
  });
  expect(onChange).toHaveBeenCalledWith("hero");
});
