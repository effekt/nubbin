import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SplitHero } from "./SplitHero";
import { splitHeroDefaults } from "./splitHeroDefaults";

describe("SplitHero", () => {
  test("renders the headline, the body, the action and the named image", () => {
    render(<SplitHero {...splitHeroDefaults} />);

    expect(screen.getByRole("heading", { name: splitHeroDefaults.headline })).toBeDefined();
    expect(screen.getByText(splitHeroDefaults.body)).toBeDefined();
    expect(screen.getByRole("link", { name: splitHeroDefaults.cta?.label ?? "" })).toBeDefined();
    expect(screen.getByRole("img").getAttribute("alt")).toBe(splitHeroDefaults.image?.alt);
  });

  test("without an image the grid never splits, and no img is rendered", () => {
    const { container } = render(<SplitHero {...splitHeroDefaults} image={undefined} />);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector(".grid")?.className.includes("grid-cols")).toBe(false);
  });

  test("without an action no link is rendered", () => {
    render(<SplitHero {...splitHeroDefaults} cta={undefined} />);

    expect(screen.queryByRole("link")).toBeNull();
  });

  test.each([
    ["start", "md:order-first"],
    ["end", "md:order-last"],
  ] as const)("mediaSide %s orders the media with %s, only from md up", (mediaSide, expected) => {
    const { container } = render(<SplitHero {...splitHeroDefaults} mediaSide={mediaSide} />);
    const classes = container.querySelector("img")?.className.split(/\s+/) ?? [];

    expect(classes).toContain(expected);
    // Below the breakpoint the halves stack in markup order: text first, media second.
    for (const token of classes) {
      if (token.includes("order-")) expect(token.startsWith("md:")).toBe(true);
    }
  });
});
