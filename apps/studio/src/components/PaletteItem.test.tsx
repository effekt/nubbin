import { Puck } from "@measured/puck";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import type { PaletteBlock } from "../nubbin/paletteGroup.types";
import { PaletteItem } from "./PaletteItem";

const hero = { name: "Hero", description: "The opening statement of a page.", icon: "hero" };

function renderItem(
  onDetail: (next: PaletteBlock | undefined) => void,
  block: PaletteBlock = hero,
  onInsert: (block: PaletteBlock) => void = () => undefined,
) {
  return render(
    <Puck
      config={{ components: {} }}
      data={{ content: [], root: { props: {} } }}
      overrides={{
        drawer: () => <PaletteItem block={block} onDetail={onDetail} onInsert={onInsert} />,
      }}
    />,
  );
}

test("renders Puck's own draggable item, so dragging stays Puck's", () => {
  renderItem(() => undefined);
  expect(screen.getByTestId("drawer-item:Hero")).toBeDefined();
  expect(screen.getAllByText("Hero").length).toBeGreaterThan(0);
});

test("renders a known icon name as its glyph before the name, hidden from assistive tech", () => {
  const { container } = renderItem(() => undefined);
  const icon = container.querySelector(".nb-palette-item-icon");
  expect(icon?.querySelector("svg")).not.toBeNull();
  expect(icon?.getAttribute("aria-hidden")).toBe("true");
});

test("keeps the icon slot empty for a block without one, so rows stay aligned", () => {
  const { container } = renderItem(() => undefined, { name: "Stack" });
  const icon = container.querySelector(".nb-palette-item-icon");
  expect(icon).not.toBeNull();
  expect(icon?.textContent).toBe("");
  expect(screen.getAllByText("Stack").length).toBeGreaterThan(0);
});

test("reports the block on hover and focus, and nothing on leaving", () => {
  const onDetail = vi.fn();
  const { container } = renderItem(onDetail);
  const row = container.querySelector(".nb-palette-item");
  if (row === null) {
    throw new Error("the palette row did not render");
  }
  fireEvent.mouseEnter(row);
  expect(onDetail).toHaveBeenLastCalledWith(hero);
  fireEvent.mouseLeave(row);
  expect(onDetail).toHaveBeenLastCalledWith(undefined);
  fireEvent.focus(screen.getByTestId("drawer-item:Hero"));
  expect(onDetail).toHaveBeenLastCalledWith(hero);
});

test("Enter on the focused row asks for the insert; other keys do not", () => {
  const onInsert = vi.fn();
  renderItem(() => undefined, hero, onInsert);
  const item = screen.getByTestId("drawer-item:Hero");
  fireEvent.keyDown(item, { key: "a" });
  expect(onInsert).not.toHaveBeenCalled();
  fireEvent.keyDown(item, { key: "Enter" });
  expect(onInsert).toHaveBeenCalledWith(hero);
});
