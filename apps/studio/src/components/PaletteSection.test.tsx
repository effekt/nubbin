import { Puck } from "@measured/puck";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PaletteSection } from "./PaletteSection";

const group = {
  title: "Content",
  blocks: [{ name: "Hero", description: "The opening statement of a page." }],
};

function renderSection(open: boolean, onToggle: () => void = () => undefined) {
  return render(
    <Puck
      config={{ components: {} }}
      data={{ content: [], root: { props: {} } }}
      overrides={{
        drawer: () => (
          <PaletteSection
            group={group}
            onDetail={() => undefined}
            onInsert={() => undefined}
            open={open}
            onToggle={onToggle}
          />
        ),
      }}
    />,
  );
}

test("open: the heading with its count pill, and a draggable row per block", () => {
  renderSection(true);
  expect(screen.getByRole("heading", { name: "Content 1" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Content 1" }).getAttribute("aria-expanded")).toBe(
    "true",
  );
  expect(screen.getByTestId("drawer-item:Hero")).toBeDefined();
});

test("collapsed: the rows unmount while the heading keeps its count", () => {
  renderSection(false);
  expect(screen.getByRole("heading", { name: "Content 1" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Content 1" }).getAttribute("aria-expanded")).toBe(
    "false",
  );
  expect(screen.queryByTestId("drawer-item:Hero")).toBeNull();
});

test("the header button reports each press to its owner", () => {
  const onToggle = vi.fn();
  renderSection(true, onToggle);
  fireEvent.click(screen.getByRole("button", { name: "Content 1" }));
  expect(onToggle).toHaveBeenCalledTimes(1);
});
