import { describe, expect, test } from "vitest";
import { productCardSchema } from "./ProductCard.schema";
import { productCardDefaults } from "./productCardDefaults";

describe("productCardSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = productCardSchema.safeParse(productCardDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(productCardDefaults);
    }
  });

  test("accepts a card with every optional field omitted", () => {
    const parsed = productCardSchema.safeParse({
      name: "Harbour chart reprint",
      price: "£12",
      description: "The 1907 survey, reprinted at a size that fits a chart table.",
    });
    expect(parsed.success).toBe(true);
  });

  test("accepts a price written as the board writes it, not as a number", () => {
    const parsed = productCardSchema.safeParse({
      ...productCardDefaults,
      price: "two for £8",
    });
    expect(parsed.success).toBe(true);
  });

  test("rejects a price longer than the board has room for", () => {
    const parsed = productCardSchema.safeParse({
      ...productCardDefaults,
      price: "£4.50 or nearest offer",
    });
    expect(parsed.success).toBe(false);
  });

  test("rejects a badge outside the closed pair", () => {
    expect(productCardSchema.safeParse({ ...productCardDefaults, badge: "sale" }).success).toBe(
      false,
    );
  });

  test("rejects an image whose alt is empty", () => {
    const parsed = productCardSchema.safeParse({
      ...productCardDefaults,
      image: { url: "/figures/tide-gauge.svg", alt: "" },
    });
    expect(parsed.success).toBe(false);
  });

  test("rejects a card without a price", () => {
    const parsed = productCardSchema.safeParse({
      name: "Harbour chart reprint",
      description: "The 1907 survey.",
    });
    expect(parsed.success).toBe(false);
  });
});
