import { Puck } from "@measured/puck";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { BlockPalette } from "./BlockPalette";
import { PREVIEW_SHOW_DELAY_MS } from "./hoverPreview.constants";

// Rendered inside a real Puck, because the rows are Puck's own Drawer.Item and need its
// provider — the same tree the drawer override mounts the palette into.
function renderPalette() {
  const groups = [
    {
      title: "Content",
      blocks: [
        { name: "Hero", description: "The opening statement of a page." },
        { name: "UpdateFeed", description: "The record of recent changes, newest first." },
      ],
    },
    { title: "Layout", blocks: [{ name: "Split", description: "Two blocks side by side." }] },
  ];
  return render(
    <Puck
      config={{ components: {} }}
      data={{ content: [], root: { props: {} } }}
      overrides={{ drawer: () => <BlockPalette groups={groups} /> }}
    />,
  );
}

const search = () => screen.getByRole("searchbox", { name: "Search blocks" });

test("lists every category with a count pill and every block at rest", () => {
  renderPalette();
  expect(screen.getByRole("heading", { name: "Content 2" })).toBeDefined();
  expect(screen.getByRole("heading", { name: "Layout 1" })).toBeDefined();
  for (const name of ["Hero", "UpdateFeed", "Split"]) {
    // Puck paints each row's label twice — the row and its drag preview — so "at least one".
    expect(screen.getAllByText(name).length).toBeGreaterThan(0);
  }
});

test("typing narrows the list by name and description, and the pills follow", () => {
  renderPalette();
  fireEvent.change(search(), { target: { value: "newest" } });
  expect(screen.getAllByText("UpdateFeed").length).toBeGreaterThan(0);
  expect(screen.queryByText("Hero")).toBeNull();
  expect(screen.queryByRole("heading", { name: "Layout 1" })).toBeNull();
  expect(screen.getByRole("heading", { name: "Content 1" })).toBeDefined();
});

test("a search matching nothing says so, and its button restores the full list", () => {
  renderPalette();
  fireEvent.change(search(), { target: { value: "carousel" } });
  expect(screen.getByText(/No blocks match “carousel”/)).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
  expect(screen.getAllByText("Hero").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Split").length).toBeGreaterThan(0);
});

test("the detail bar swaps its hint for the hovered block's line, and back", () => {
  const { container } = renderPalette();
  const bar = container.querySelector("[aria-live='polite']");
  expect(bar?.textContent).toBe("Hover a block to see what it is for.");
  const row = container.querySelector(".nb-palette-item");
  expect(row).not.toBeNull();
  if (row === null) {
    return;
  }
  fireEvent.mouseEnter(row);
  expect(bar?.textContent).toBe("Hero — The opening statement of a page.");
  fireEvent.mouseLeave(row);
  expect(bar?.textContent).toBe("Hover a block to see what it is for.");
});

test("a keystroke resets the detail, since the pointed-at row may have just unmounted", () => {
  const { container } = renderPalette();
  const row = container.querySelector(".nb-palette-item");
  if (row === null) {
    throw new Error("the palette row did not render");
  }
  fireEvent.mouseEnter(row);
  fireEvent.change(search(), { target: { value: "carousel" } });
  expect(container.querySelector("[aria-live='polite']")?.textContent).toBe(
    "Hover a block to see what it is for.",
  );
});

test("hovering a row floats the block's rendered preview after the delay, and Escape dismisses it", () => {
  vi.useFakeTimers();
  try {
    const { container } = renderPalette();
    const row = container.querySelector(".nb-palette-item");
    if (row === null) {
      throw new Error("the palette row did not render");
    }
    fireEvent.mouseEnter(row);
    expect(document.querySelector(".nb-palette-preview")).toBeNull();
    act(() => vi.advanceTimersByTime(PREVIEW_SHOW_DELAY_MS));
    const frame = document.querySelector(".nb-palette-preview iframe");
    expect(frame?.getAttribute("src")).toBe("/block-preview/Hero");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".nb-palette-preview")).toBeNull();
  } finally {
    vi.useRealTimers();
  }
});

test("a section collapses to its header and count, and search forces it open again", () => {
  renderPalette();
  const content = screen.getByRole("button", { name: "Content" });
  fireEvent.click(content);
  expect(screen.getByRole("heading", { name: "Content 2" })).toBeDefined();
  expect(screen.queryByTestId("drawer-item:Hero")).toBeNull();
  // Layout was not collapsed, so its rows stand.
  expect(screen.getByTestId("drawer-item:Split")).toBeDefined();
  // A query matching a hidden block must show it — a collapsed section would look broken.
  fireEvent.change(search(), { target: { value: "newest" } });
  expect(screen.getByTestId("drawer-item:UpdateFeed")).toBeDefined();
  // Clearing the search restores the collapse the reader chose.
  fireEvent.change(search(), { target: { value: "" } });
  expect(screen.queryByTestId("drawer-item:Hero")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Content" }));
  expect(screen.getByTestId("drawer-item:Hero")).toBeDefined();
});
