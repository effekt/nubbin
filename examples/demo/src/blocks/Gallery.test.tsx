import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Gallery } from "./Gallery";
import { galleryDefaults } from "./galleryDefaults";

describe("Gallery", () => {
  test("renders one captioned figure per picture, each naming its content", () => {
    const { container } = render(<Gallery {...galleryDefaults} />);

    const rows = container.querySelectorAll("li");
    expect(rows).toHaveLength(galleryDefaults.items.length);
    for (const [index, item] of galleryDefaults.items.entries()) {
      const figure = rows[index]?.querySelector("figure");
      expect(figure?.querySelector("img")?.getAttribute("alt")).toBe(item.alt);
      expect(figure?.querySelector("figcaption")?.textContent).toBe(item.caption);
    }
  });

  test("a picture without a caption renders no empty figcaption", () => {
    const [first, ...rest] = galleryDefaults.items;
    if (first === undefined) {
      throw new Error("defaults hold no items");
    }
    const { container } = render(
      <Gallery {...galleryDefaults} items={[{ url: first.url, alt: first.alt }, ...rest]} />,
    );

    expect(container.querySelectorAll("li")[0]?.querySelector("figcaption")).toBeNull();
  });

  test("without a heading the set still names itself to assistive tech", () => {
    const { container } = render(<Gallery {...galleryDefaults} heading={undefined} />);

    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("sr-only");
    expect(heading?.textContent).toBe("In pictures");
  });

  test("the strip lays pictures in a scrolling row rather than a wrapping grid", () => {
    const { container } = render(<Gallery {...galleryDefaults} layout="strip" />);

    const list = container.querySelector("ul");
    expect(list?.className).toContain("overflow-x-auto");
    expect(list?.className).not.toContain("grid-cols");
  });
});
