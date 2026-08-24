import { describe, expect, test } from "vitest";
import { splitSchema } from "./Split.schema";
import { splitDefaults } from "./splitDefaults";

describe("splitSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = splitSchema.safeParse(splitDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(splitDefaults);
    }
  });

  test.each(["even", "wide-start", "wide-end"] as const)("accepts the %s ratio", (ratio) => {
    expect(splitSchema.safeParse({ ratio, tone: "dark" }).success).toBe(true);
  });

  test("rejects a ratio outside the closed set", () => {
    expect(splitSchema.safeParse({ ratio: "golden" }).success).toBe(false);
  });

  test("rejects a tone outside the closed set", () => {
    expect(splitSchema.safeParse({ ratio: "even", tone: "sepia" }).success).toBe(false);
  });
});
