import { describe, expect, test } from "vitest";
import { statBandSchema } from "./StatBand.schema";
import { statBandDefaults } from "./statBandDefaults";

describe("statBandSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = statBandSchema.safeParse(statBandDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(statBandDefaults);
    }
  });

  test("rejects one figure standing alone, naming the field", () => {
    const parsed = statBandSchema.safeParse({
      ...statBandDefaults,
      stats: statBandDefaults.stats.slice(0, 1),
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["stats"]);
    }
  });

  test("accepts four figures and rejects a fifth, naming the field", () => {
    const figures = Array.from({ length: 5 }, (_, index) => ({
      value: String(index),
      label: `figure ${index}`,
    }));
    expect(
      statBandSchema.safeParse({ ...statBandDefaults, stats: figures.slice(0, 4) }).success,
    ).toBe(true);
    const parsed = statBandSchema.safeParse({ ...statBandDefaults, stats: figures });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["stats"]);
    }
  });

  test("rejects a value past twelve characters: a figure, not a sentence", () => {
    const parsed = statBandSchema.safeParse({
      ...statBandDefaults,
      stats: [{ value: "a".repeat(13), label: "too long to glance" }, statBandDefaults.stats[1]],
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["stats", 0, "value"]);
    }
  });

  test("a band with no heading is a state an author can save", () => {
    expect(statBandSchema.safeParse({ stats: statBandDefaults.stats, tone: "light" }).success).toBe(
      true,
    );
  });
});
