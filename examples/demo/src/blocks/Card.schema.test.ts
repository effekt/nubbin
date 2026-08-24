import { describe, expect, test } from "vitest";
import { cardSchema } from "./Card.schema";
import { cardDefaults } from "./cardDefaults";

describe("cardSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = cardSchema.safeParse(cardDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(cardDefaults);
    }
  });

  test("accepts a card with every optional field omitted", () => {
    const parsed = cardSchema.safeParse({
      title: "Low water at noon",
      summary: "The channel narrows to a boat's width.",
    });
    expect(parsed.success).toBe(true);
  });

  test("rejects a badge outside the closed pair", () => {
    expect(cardSchema.safeParse({ ...cardDefaults, badge: "featured" }).success).toBe(false);
  });

  test("rejects a card without a summary", () => {
    expect(cardSchema.safeParse({ title: "Low water at noon" }).success).toBe(false);
  });
});
