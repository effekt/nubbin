import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { PaletteIcon } from "./PaletteIcon";

const registeredIcons = [
  "hero",
  "split",
  "splithero",
  "header",
  "masthead",
  "footer",
  "prose",
  "pricelist",
  "faq",
  "banner",
  "card",
  "grid",
  "tag",
  "products",
  "logos",
  "features",
  "band",
  "stats",
  "feed",
  "stack",
  "video",
  "megaphone",
  "clock",
  "quote",
  "figure",
  "gallery",
];

test("a known icon name renders the studio's monoline SVG, hidden from assistive tech", () => {
  const { container } = render(<PaletteIcon icon="hero" />);
  const svg = container.querySelector("svg");
  expect(svg).not.toBeNull();
  expect(svg?.getAttribute("aria-hidden")).toBe("true");
});

test("an unknown string renders as text, so a consumer's own icon still shows", () => {
  const { container } = render(<PaletteIcon icon="🎈" />);
  expect(container.querySelector("svg")).toBeNull();
  expect(container.textContent).toBe("🎈");
});

test("no icon renders nothing", () => {
  const { container } = render(<PaletteIcon icon={undefined} />);
  expect(container.textContent).toBe("");
  expect(container.querySelector("svg")).toBeNull();
});

test("every registered icon has a drawn glyph, not the text fallback", () => {
  for (const name of registeredIcons) {
    const { container, unmount } = render(<PaletteIcon icon={name} />);
    expect(container.querySelector("svg"), name).not.toBeNull();
    unmount();
  }
});

test("every registered icon has its own name and drawing", () => {
  expect(new Set(registeredIcons).size).toBe(registeredIcons.length);
  const drawings = registeredIcons.map((name) => {
    const { container, unmount } = render(<PaletteIcon icon={name} />);
    const markup = container.innerHTML;
    unmount();
    return markup;
  });
  expect(new Set(drawings).size).toBe(registeredIcons.length);
});
