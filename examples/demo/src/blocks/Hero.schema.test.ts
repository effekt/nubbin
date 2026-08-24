import { describe, expect, test } from "vitest";
import { heroSchema } from "./Hero.schema";
import { heroDefaults } from "./heroDefaults";

describe("heroSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = heroSchema.safeParse(heroDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(heroDefaults);
    }
  });

  test("accepts a headline at the bound", () => {
    const headline = "a".repeat(60);
    expect(heroSchema.safeParse({ ...heroDefaults, headline }).success).toBe(true);
  });

  test("rejects a headline past the bound, naming the field", () => {
    const parsed = heroSchema.safeParse({ ...heroDefaults, headline: "a".repeat(61) });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["headline"]);
    }
  });

  test("rejects a tone outside the closed set", () => {
    expect(heroSchema.safeParse({ ...heroDefaults, tone: "sepia" }).success).toBe(false);
  });
});
