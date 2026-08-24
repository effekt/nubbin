import { describe, expect, test } from "vitest";
import { splitHeroSchema } from "./SplitHero.schema";
import { splitHeroDefaults } from "./splitHeroDefaults";

describe("splitHeroSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = splitHeroSchema.safeParse(splitHeroDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(splitHeroDefaults);
    }
  });

  test("accepts a headline at the bound and rejects one past it, naming the field", () => {
    expect(
      splitHeroSchema.safeParse({ ...splitHeroDefaults, headline: "a".repeat(70) }).success,
    ).toBe(true);
    const parsed = splitHeroSchema.safeParse({ ...splitHeroDefaults, headline: "a".repeat(71) });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["headline"]);
    }
  });

  test("accepts a text-only opener: no image, no action", () => {
    const { image, cta, ...text } = splitHeroDefaults;
    expect(splitHeroSchema.safeParse(text).success).toBe(true);
  });

  test("rejects an image present without its alt, naming the path", () => {
    const parsed = splitHeroSchema.safeParse({
      ...splitHeroDefaults,
      image: { url: "/hero-pricing.svg" },
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["image", "alt"]);
    }
  });

  test("rejects a media side outside the closed set", () => {
    expect(splitHeroSchema.safeParse({ ...splitHeroDefaults, mediaSide: "left" }).success).toBe(
      false,
    );
  });
});
