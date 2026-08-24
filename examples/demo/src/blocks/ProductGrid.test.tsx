import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ProductGrid } from "./ProductGrid";
import { productGridDefaults } from "./productGridDefaults";

describe("ProductGrid", () => {
  test("renders its heading over the slot's children", () => {
    const { container } = render(
      <ProductGrid {...productGridDefaults} products={<article>one card</article>} />,
    );

    expect(container.querySelector("h2")?.textContent).toBe(productGridDefaults.heading);
    expect(container.textContent).toContain("one card");
  });

  test("without a heading the shelf still names itself to assistive tech", () => {
    const { container } = render(<ProductGrid heading={undefined} />);

    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("sr-only");
    expect(heading?.textContent).toBe("For sale");
  });
});
