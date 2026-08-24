import { Puck } from "@measured/puck";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import type { PaletteBlock } from "../nubbin/paletteGroup.types";
import { PaletteItem } from "./PaletteItem";

const hero = { name: "Hero", description: "The opening statement of a page." };

function renderItem(onDetail: (next: PaletteBlock | undefined) => void) {
  return render(
    <Puck
      config={{ components: {} }}
      data={{ content: [], root: { props: {} } }}
      overrides={{ drawer: () => <PaletteItem block={hero} onDetail={onDetail} /> }}
    />,
  );
}

test("renders Puck's own draggable item, so dragging stays Puck's", () => {
  renderItem(() => undefined);
  expect(screen.getByTestId("drawer-item:Hero")).toBeDefined();
  expect(screen.getAllByText("Hero").length).toBeGreaterThan(0);
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
