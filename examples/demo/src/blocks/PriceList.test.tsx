import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PriceList } from "./PriceList";
import { priceListDefaults } from "./priceListDefaults";

describe("PriceList", () => {
  test("renders one definition per row, keeping each item with its price", () => {
    const { container } = render(<PriceList {...priceListDefaults} />);

    const items = [...container.querySelectorAll("dt")].map((dt) => dt.textContent);
    const prices = [...container.querySelectorAll("dd")].map((dd) => dd.textContent);
    expect(items).toEqual(priceListDefaults.rows.map((row) => row.item));
    expect(prices).toEqual(priceListDefaults.rows.map((row) => row.price));
  });

  test("without a heading the board still names itself to assistive tech", () => {
    const { container } = render(<PriceList {...priceListDefaults} heading={undefined} />);

    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("sr-only");
    expect(heading?.textContent).toBe("Prices");
  });
});
