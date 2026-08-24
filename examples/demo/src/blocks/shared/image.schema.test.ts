import { describe, expect, test } from "vitest";
import { imageSchema } from "./image.schema";

describe("imageSchema", () => {
  test("accepts a real image reference", () => {
    const parsed = imageSchema.safeParse({ url: "/figures/foreshore.svg", alt: "The foreshore" });
    expect(parsed.success).toBe(true);
  });

  test.each([
    ["url", { url: "", alt: "The foreshore" }],
    ["alt", { url: "/figures/foreshore.svg", alt: "" }],
  ])(
    "refuses an empty %s — a blank src re-requests the page, a blank alt says nothing",
    (field, value) => {
      const parsed = imageSchema.safeParse(value);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toEqual([field]);
      }
    },
  );
});
