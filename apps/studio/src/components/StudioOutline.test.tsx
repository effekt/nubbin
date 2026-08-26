import { Puck, type PuckApi } from "@measured/puck";
import { PuckApiBridge } from "@nubbin/studio-ui";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { StudioOutline } from "./StudioOutline";

// A real Puck carries the store the outline reads and selects through — the same tree the
// outline override mounts it into.
function renderOutline() {
  const apiRef: { current: (() => PuckApi) | undefined } = { current: undefined };
  render(
    <Puck
      config={{
        components: {
          Stack: { fields: { children: { type: "slot" } }, render: () => <div /> },
          Hero: { render: () => <div /> },
          Faq: { fields: { help: { type: "slot" } }, render: () => <div /> },
        },
      }}
      data={{
        content: [
          {
            type: "Stack",
            props: {
              id: "stack-1",
              children: [
                { type: "Hero", props: { id: "hero-1" } },
                { type: "Faq", props: { id: "faq-1" } },
              ],
            },
          },
        ],
        root: { props: {} },
      }}
      overrides={{
        outline: () => (
          <StudioOutline
            icons={{ Hero: "hero" }}
            slotsByBlock={{ Stack: { children: { max: 12 } }, Hero: {}, Faq: { help: {} } }}
          />
        ),
        puck: ({ children }) => (
          <>
            <PuckApiBridge apiRef={apiRef} />
            {children}
          </>
        ),
      }}
    />,
  );
  return apiRef;
}

test("heads itself with the page's block count and lists every block and area", () => {
  renderOutline();
  expect(screen.getByRole("heading", { name: "Page outline" })).toBeDefined();
  expect(screen.getByText("3 blocks")).toBeDefined();
  expect(screen.getByRole("button", { name: "Stack" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Hero" })).toBeDefined();
  // The bounded area carries its fullness against the declared max; Faq's empty area shows 0.
  expect(screen.getByText("2 of 12")).toBeDefined();
  expect(screen.getByText("0")).toBeDefined();
});

test("a block's glyph is the palette's; a block without one shows none", () => {
  renderOutline();
  const hero = screen.getByRole("button", { name: "Hero" });
  expect(hero.querySelector("svg")).not.toBeNull();
  const faq = screen.getByRole("button", { name: "Faq" });
  expect(faq.querySelector(".nb-outline-glyph svg")).toBeNull();
});

test("clicking a block's name selects it in the editor", () => {
  const apiRef = renderOutline();
  fireEvent.click(screen.getByRole("button", { name: "Hero" }));
  expect(apiRef.current?.().selectedItem?.props.id).toBe("hero-1");
});

test("collapsing an area unmounts the blocks inside; the chip stays", () => {
  renderOutline();
  fireEvent.click(screen.getByRole("button", { name: /children/i }));
  expect(screen.queryByRole("button", { name: "Hero" })).toBeNull();
  expect(screen.getByText("2 of 12")).toBeDefined();
});

test("the legend describing the area rows sits at the card's foot", () => {
  renderOutline();
  expect(screen.getByText(/Small-caps rows are areas/)).toBeDefined();
});
