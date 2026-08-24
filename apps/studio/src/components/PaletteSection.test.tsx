import { Puck } from "@measured/puck";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PaletteSection } from "./PaletteSection";

test("carries the category heading, the count pill, and a draggable row per block", () => {
  const group = {
    title: "Content",
    blocks: [{ name: "Hero", description: "The opening statement of a page." }],
  };
  render(
    <Puck
      config={{ components: {} }}
      data={{ content: [], root: { props: {} } }}
      overrides={{ drawer: () => <PaletteSection group={group} onDetail={() => undefined} /> }}
    />,
  );
  expect(screen.getByRole("heading", { name: "Content 1" })).toBeDefined();
  expect(screen.getByTestId("drawer-item:Hero")).toBeDefined();
});
