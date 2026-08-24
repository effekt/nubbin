import { describe, expect, test } from "vitest";
import { productGridSchema } from "./ProductGrid.schema";
import { productGridDefaults } from "./productGridDefaults";

describe("productGridSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = productGridSchema.safeParse(productGridDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(productGridDefaults);
    }
  });

  test("accepts a grid with no heading", () => {
    expect(productGridSchema.safeParse({}).success).toBe(true);
  });

  test("rejects a heading past the length the row can carry", () => {
    const heading = "The chandlery, the stockists, the back counter and everything on it".repeat(2);
    expect(productGridSchema.safeParse({ heading }).success).toBe(false);
  });
});
