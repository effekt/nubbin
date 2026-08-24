import { describe, expect, test } from "vitest";
import { cardGridSchema } from "./CardGrid.schema";
import { cardGridDefaults } from "./cardGridDefaults";

describe("cardGridSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = cardGridSchema.safeParse(cardGridDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(cardGridDefaults);
    }
  });

  test("accepts a grid with no heading", () => {
    expect(cardGridSchema.safeParse({ columns: "two" }).success).toBe(true);
  });

  test.each(["four", 3])("rejects the column count %s", (columns) => {
    expect(cardGridSchema.safeParse({ ...cardGridDefaults, columns }).success).toBe(false);
  });
});
