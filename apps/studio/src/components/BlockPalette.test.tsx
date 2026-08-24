import { Puck, type PuckApi } from "@measured/puck";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { RefObject } from "react";
import { expect, test, vi } from "vitest";
import { BlockPalette } from "./BlockPalette";
import { PREVIEW_SHOW_DELAY_MS } from "./hoverPreview.constants";
import { PuckApiBridge } from "./PuckApiBridge";

// Rendered inside a real Puck, because the rows are Puck's own Drawer.Item and need its
// provider — the same tree the drawer override mounts the palette into. The api ref is
// bridged the way the editor bridges it, so Enter inserts through the real store.
function renderPalette() {
  const apiRef: RefObject<(() => PuckApi) | undefined> = { current: undefined };
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
  const config = {
    components: {
      Hero: { render: () => <div /> },
      UpdateFeed: { render: () => <div /> },
      Split: { render: () => <div /> },
    },
  };
  const rendered = render(
    <Puck
      config={config}
      data={{ content: [], root: { props: {} } }}
      overrides={{
        drawer: () => <BlockPalette groups={groups} apiRef={apiRef} />,
        puck: ({ children }) => (
          <>
            <PuckApiBridge apiRef={apiRef} />
            {children}
          </>
        ),
      }}
    />,
  );
  return { ...rendered, apiRef };
}

const search = () => screen.getByRole("searchbox", { name: "Search blocks" });

test("titles itself Blocks beside a search that quotes the catalog's count", () => {
  renderPalette();
  expect(screen.getByRole("heading", { name: "Blocks" })).toBeDefined();
  expect(search().getAttribute("placeholder")).toBe("Search 3 blocks…");
});

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

test("the footer hint never moves while the live region reads the pointed-at block", () => {
  const { container } = renderPalette();
  const hint = "Drag a block in, or press Enter to add it at the selection.";
  const live = container.querySelector("[aria-live='polite']");
  expect(screen.getByText(hint)).toBeDefined();
  expect(live?.textContent).toBe("");
  const row = container.querySelector(".nb-palette-item");
  expect(row).not.toBeNull();
  if (row === null) {
    return;
  }
  fireEvent.mouseEnter(row);
  expect(live?.textContent).toBe("Hero — The opening statement of a page.");
  // The visible strip is the same line as before — the list above must not shift.
  expect(screen.getByText(hint)).toBeDefined();
  fireEvent.mouseLeave(row);
  expect(live?.textContent).toBe("");
});

test("Enter on a focused row inserts that block into the page", () => {
  const { apiRef } = renderPalette();
  const item = screen.getByTestId("drawer-item:Hero");
  fireEvent.keyDown(item, { key: "Enter" });
  const content = apiRef.current?.().appState.data.content ?? [];
  expect(content.map((node) => node.type)).toEqual(["Hero"]);
});

test("a keystroke resets the detail, since the pointed-at row may have just unmounted", () => {
  const { container } = renderPalette();
  const row = container.querySelector(".nb-palette-item");
  if (row === null) {
    throw new Error("the palette row did not render");
  }
  fireEvent.mouseEnter(row);
  fireEvent.change(search(), { target: { value: "carousel" } });
  expect(container.querySelector("[aria-live='polite']")?.textContent).toBe("");
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
  const content = screen.getByRole("button", { name: "Content 2" });
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
  fireEvent.click(screen.getByRole("button", { name: "Content 2" }));
  expect(screen.getByTestId("drawer-item:Hero")).toBeDefined();
});
