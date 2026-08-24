import { render } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";
import { BlockPreviewPanel } from "./BlockPreviewPanel";

const hero = { name: "Hero", description: "The opening statement of a page." };
const split = { name: "Split", description: "Two blocks side by side." };

const anchored = () => {
  const anchor = createRef<HTMLElement | null>();
  anchor.current = document.createElement("div");
  document.body.appendChild(anchor.current);
  return anchor;
};

test("an iframe of the block's preview page, inert and hidden from assistive tech", () => {
  render(<BlockPreviewPanel block={hero} anchor={anchored()} />);
  const panel = document.querySelector(".nb-palette-preview");
  expect(panel?.closest("[aria-hidden='true']")).not.toBeNull();
  const frame = panel?.querySelector("iframe");
  expect(frame?.getAttribute("src")).toBe("/block-preview/Hero");
  expect(frame?.getAttribute("tabindex")).toBe("-1");
});

test("the header carries the block's name and its full description", () => {
  render(<BlockPreviewPanel block={hero} anchor={anchored()} />);
  const header = document.querySelector(".nb-palette-preview-header");
  expect(header?.querySelector("strong")?.textContent).toBe("Hero");
  expect(header?.querySelector("p")?.textContent).toBe(hero.description);
});

test("a block without a description gets a header of just the name", () => {
  render(<BlockPreviewPanel block={{ name: "Hero" }} anchor={anchored()} />);
  const header = document.querySelector(".nb-palette-preview-header");
  expect(header?.querySelector("strong")?.textContent).toBe("Hero");
  expect(header?.querySelector("p")).toBeNull();
});

test("no block, no panel", () => {
  render(<BlockPreviewPanel block={undefined} anchor={anchored()} />);
  expect(document.querySelector(".nb-palette-preview")).toBeNull();
});

test("swapping blocks swaps the iframe's src without replacing the element", () => {
  const anchor = anchored();
  const { rerender } = render(<BlockPreviewPanel block={hero} anchor={anchor} />);
  const frame = document.querySelector(".nb-palette-preview iframe");
  rerender(<BlockPreviewPanel block={split} anchor={anchor} />);
  const after = document.querySelector(".nb-palette-preview iframe");
  expect(after).toBe(frame);
  expect(after?.getAttribute("src")).toBe("/block-preview/Split");
});
