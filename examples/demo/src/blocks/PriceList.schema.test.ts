import { describe, expect, test } from "vitest";
import { priceListSchema } from "./PriceList.schema";
import { priceListDefaults } from "./priceListDefaults";

describe("priceListSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = priceListSchema.safeParse(priceListDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(priceListDefaults);
    }
  });

  test("accepts a board with no heading", () => {
    const { heading: _heading, ...rest } = priceListDefaults;
    expect(priceListSchema.safeParse(rest).success).toBe(true);
  });

  test("rejects a single row, which is a card rather than a board", () => {
    const rows = priceListDefaults.rows.slice(0, 1);
    expect(priceListSchema.safeParse({ ...priceListDefaults, rows }).success).toBe(false);
  });

  test("rejects a board past twelve rows", () => {
    const row = { item: "Chart weights, each", price: "£3" };
    const rows = Array.from({ length: 13 }, () => row);
    expect(priceListSchema.safeParse({ ...priceListDefaults, rows }).success).toBe(false);
  });

  test("rejects a row whose price runs past the board", () => {
    const rows = [
      ...priceListDefaults.rows,
      { item: "Rope, by the metre", price: "ask at the counter" },
    ];
    expect(priceListSchema.safeParse({ ...priceListDefaults, rows }).success).toBe(false);
  });
});
