import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ProductCard } from "./ProductCard";
import { productCardDefaults } from "./productCardDefaults";

describe("ProductCard", () => {
  test("renders the name as a link when the card goes somewhere", () => {
    const { container } = render(<ProductCard {...productCardDefaults} />);

    const link = container.querySelector("h3 a");
    expect(link?.getAttribute("href")).toBe(productCardDefaults.href);
    expect(link?.textContent).toBe(productCardDefaults.name);
  });

  test("prints the price as given, beside the name", () => {
    const { container } = render(<ProductCard {...productCardDefaults} price="two for £8" />);

    expect(container.textContent).toContain("two for £8");
  });

  test("without an href the name is plain text, not an empty anchor", () => {
    const { container } = render(<ProductCard {...productCardDefaults} href={undefined} />);

    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("h3")?.textContent).toBe(productCardDefaults.name);
  });

  test("a badge renders its visible wording, not the stored value", () => {
    const { container } = render(<ProductCard {...productCardDefaults} badge="back-in-stock" />);

    expect(container.textContent).toContain("Back in stock");
    expect(container.textContent).not.toContain("back-in-stock");
  });

  test("an image names its content; no image renders no img at all", () => {
    const image = { url: "/figures/tide-gauge.svg", alt: "The tide gauge at the harbour arm" };
    const withImage = render(<ProductCard {...productCardDefaults} image={image} />);
    expect(withImage.container.querySelector("img")?.getAttribute("alt")).toBe(image.alt);

    const without = render(<ProductCard {...productCardDefaults} />);
    expect(without.container.querySelector("img")).toBeNull();
  });
});
