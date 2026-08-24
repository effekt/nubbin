import { describe, expect, test } from "vitest";
import { countdownBannerSchema } from "./CountdownBanner.schema";
import { countdownBannerDefaults } from "./countdownBannerDefaults";

describe("countdownBannerSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = countdownBannerSchema.safeParse(countdownBannerDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(countdownBannerDefaults);
    }
  });

  test("accepts text at the bound and rejects text past it, naming the field", () => {
    expect(
      countdownBannerSchema.safeParse({ ...countdownBannerDefaults, text: "a".repeat(80) }).success,
    ).toBe(true);
    const parsed = countdownBannerSchema.safeParse({
      ...countdownBannerDefaults,
      text: "a".repeat(81),
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["text"]);
    }
  });

  test.each(["tomorrow", "22 September", "2026-09-22"])(
    "rejects %s: a deadline is a full ISO datetime, naming the field",
    (deadline) => {
      const parsed = countdownBannerSchema.safeParse({ ...countdownBannerDefaults, deadline });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toEqual(["deadline"]);
      }
    },
  );
});
