import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SiteHeader } from "./SiteHeader";
import { siteHeaderDefaults } from "./siteHeaderDefaults";

describe("SiteHeader", () => {
  test("renders a labelled nav landmark holding every link as a real anchor", () => {
    const { container } = render(<SiteHeader {...siteHeaderDefaults} />);

    const nav = container.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe("Site");
    const anchors = [...(nav?.querySelectorAll("a") ?? [])];
    expect(anchors.map((a) => a.getAttribute("href"))).toEqual(
      siteHeaderDefaults.links.map((link) => link.href),
    );
    expect(anchors.map((a) => a.textContent)).toEqual(
      siteHeaderDefaults.links.map((link) => link.label),
    );
  });

  test("one root element, so the renderer's rule holds", () => {
    const { container } = render(<SiteHeader {...siteHeaderDefaults} />);

    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild?.tagName).toBe("HEADER");
  });

  test("the dark tone paints the dark ground", () => {
    const { container } = render(<SiteHeader {...siteHeaderDefaults} tone="dark" />);

    expect(container.querySelector("header")?.className).toContain("bg-marine");
  });
});
