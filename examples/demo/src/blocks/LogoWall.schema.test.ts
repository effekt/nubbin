import { describe, expect, test } from "vitest";
import { logoWallSchema } from "./LogoWall.schema";
import { logoWallDefaults } from "./logoWallDefaults";

describe("logoWallSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = logoWallSchema.safeParse(logoWallDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(logoWallDefaults);
    }
  });

  test("a wall with no heading is a state an author can save", () => {
    expect(logoWallSchema.safeParse({ items: logoWallDefaults.items }).success).toBe(true);
  });

  test("rejects a single mark: one name is a mention, not a wall", () => {
    const parsed = logoWallSchema.safeParse({
      ...logoWallDefaults,
      items: logoWallDefaults.items.slice(0, 1),
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["items"]);
    }
  });

  test("accepts eight marks and rejects a ninth, naming the field", () => {
    const marks = Array.from({ length: 9 }, (_, index) => ({ name: `Harbour ${index + 1}` }));
    expect(logoWallSchema.safeParse({ items: marks.slice(0, 8) }).success).toBe(true);
    const parsed = logoWallSchema.safeParse({ items: marks });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["items"]);
    }
  });

  test("rejects a mark named past its bound, naming the nested path", () => {
    const parsed = logoWallSchema.safeParse({
      ...logoWallDefaults,
      items: [{ name: "a".repeat(41) }, { name: "The Long Reach Ferry" }],
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["items", 0, "name"]);
    }
  });
});
