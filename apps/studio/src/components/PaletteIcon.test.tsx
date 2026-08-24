import { render } from "@testing-library/react";
import { registry } from "demo/src/nubbin/registry";
import { expect, test } from "vitest";
import { PaletteIcon } from "./PaletteIcon";

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

test("every icon the demo's registry names has a drawn glyph, not the text fallback", () => {
  const names = registry
    .names()
    .map((name) => registry.get(name)?.icon)
    .filter((icon): icon is string => icon !== undefined);
  expect(names.length).toBeGreaterThan(0);
  for (const name of names) {
    const { container, unmount } = render(<PaletteIcon icon={name} />);
    expect(container.querySelector("svg"), name).not.toBeNull();
    unmount();
  }
});

test("no two icon names the registry uses draw the same glyph", () => {
  const names = [
    ...new Set(
      registry
        .names()
        .map((name) => registry.get(name)?.icon)
        .filter((icon): icon is string => icon !== undefined),
    ),
  ];
  const drawings = names.map((name) => {
    const { container, unmount } = render(<PaletteIcon icon={name} />);
    const markup = container.innerHTML;
    unmount();
    return markup;
  });
  expect(new Set(drawings).size).toBe(names.length);
});
