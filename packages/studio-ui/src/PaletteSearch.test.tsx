import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PaletteSearch } from "./PaletteSearch";

test("is a labelled search input whose placeholder quotes the catalog's count", () => {
  render(<PaletteSearch query="" total={13} onChange={() => undefined} />);
  const input = screen.getByRole("searchbox", { name: "Search blocks" });
  expect(input.getAttribute("placeholder")).toBe("Search 13 blocks…");
});

test("reports every keystroke to the caller", () => {
  const onChange = vi.fn();
  render(<PaletteSearch query="" total={13} onChange={onChange} />);
  fireEvent.change(screen.getByRole("searchbox", { name: "Search blocks" }), {
    target: { value: "hero" },
  });
  expect(onChange).toHaveBeenCalledWith("hero");
});
