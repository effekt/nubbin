import { fireEvent, render } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";
import { BlockPreviewPanel } from "./BlockPreviewPanel";

const hero = { name: "Hero", description: "The opening statement of a page." };
const split = { name: "Split", description: "Two blocks side by side." };
const previewHref = (name: string) => `/block-preview/${name}`;

const anchored = () => {
  const anchor = createRef<HTMLElement | null>();
  anchor.current = document.createElement("div");
  document.body.appendChild(anchor.current);
  return anchor;
};

test("an iframe of the block's preview page, inert and hidden from assistive tech", () => {
  render(<BlockPreviewPanel block={hero} anchor={anchored()} previewHref={previewHref} />);
  const panel = document.querySelector(".nb-palette-preview");
  expect(panel?.closest("[aria-hidden='true']")).not.toBeNull();
  const frame = panel?.querySelector("iframe");
  expect(frame?.getAttribute("src")).toBe("/block-preview/Hero");
  expect(frame?.getAttribute("tabindex")).toBe("-1");
});

test("the header carries the block's name and its full description", () => {
  render(<BlockPreviewPanel block={hero} anchor={anchored()} previewHref={previewHref} />);
  const header = document.querySelector(".nb-palette-preview-header");
  expect(header?.querySelector("strong")?.textContent).toBe("Hero");
  expect(header?.querySelector("p")?.textContent).toBe(hero.description);
});

test("a block without a description gets a header of just the name", () => {
  render(
    <BlockPreviewPanel block={{ name: "Hero" }} anchor={anchored()} previewHref={previewHref} />,
  );
  const header = document.querySelector(".nb-palette-preview-header");
  expect(header?.querySelector("strong")?.textContent).toBe("Hero");
  expect(header?.querySelector("p")).toBeNull();
});

test("no block, no panel", () => {
  render(<BlockPreviewPanel block={undefined} anchor={anchored()} previewHref={previewHref} />);
  expect(document.querySelector(".nb-palette-preview")).toBeNull();
});

test("opens compact — loading strip shown, iframe invisible — and grows once measured", () => {
  render(<BlockPreviewPanel block={hero} anchor={anchored()} previewHref={previewHref} />);
  const region = document.querySelector<HTMLElement>(".nb-palette-preview-frame");
  const frame = region?.querySelector("iframe");
  expect(region?.style.height).toBe("72px");
  expect(region?.querySelector(".nb-palette-preview-loading")).not.toBeNull();
  expect(frame?.style.opacity).toBe("0");
  if (frame == null) {
    throw new Error("the preview iframe did not render");
  }
  // jsdom lays nothing out, so the loaded document's height is stamped on it — the real
  // measurer reads exactly this property off the body.
  const body = frame.contentDocument?.body;
  if (body == null) {
    throw new Error("the iframe has no measurable document");
  }
  Object.defineProperty(body, "scrollHeight", { value: 500 });
  fireEvent.load(frame);
  expect(region?.querySelector(".nb-palette-preview-loading")).toBeNull();
  expect(frame.style.opacity).toBe("1");
  // 500 content pixels at the panel's 0.4 scale — grown from the 72px strip.
  expect(region?.style.height).toBe("200px");
});

test("swapping blocks swaps the iframe's src without replacing the element", () => {
  const anchor = anchored();
  const { rerender } = render(
    <BlockPreviewPanel block={hero} anchor={anchor} previewHref={previewHref} />,
  );
  const frame = document.querySelector(".nb-palette-preview iframe");
  rerender(<BlockPreviewPanel block={split} anchor={anchor} previewHref={previewHref} />);
  const after = document.querySelector(".nb-palette-preview iframe");
  expect(after).toBe(frame);
  expect(after?.getAttribute("src")).toBe("/block-preview/Split");
});
