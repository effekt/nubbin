import { describe, expect, test } from "vitest";
import { videoHeroSchema } from "./VideoHero.schema";
import { videoHeroDefaults } from "./videoHeroDefaults";

describe("videoHeroSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = videoHeroSchema.safeParse(videoHeroDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(videoHeroDefaults);
    }
  });

  test("accepts a headline at the bound and rejects one past it, naming the field", () => {
    expect(
      videoHeroSchema.safeParse({ ...videoHeroDefaults, headline: "a".repeat(70) }).success,
    ).toBe(true);
    const parsed = videoHeroSchema.safeParse({ ...videoHeroDefaults, headline: "a".repeat(71) });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["headline"]);
    }
  });

  test("rejects a poster without its alt, naming the path", () => {
    const parsed = videoHeroSchema.safeParse({
      ...videoHeroDefaults,
      poster: { url: "/hero-board.svg" },
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["poster", "alt"]);
    }
  });

  test("rejects an overlay outside the closed set", () => {
    expect(videoHeroSchema.safeParse({ ...videoHeroDefaults, overlay: "sepia" }).success).toBe(
      false,
    );
  });
});
