import { describe, expect, test } from "vitest";
import { gallerySchema } from "./Gallery.schema";
import { galleryDefaults } from "./galleryDefaults";

describe("gallerySchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = gallerySchema.safeParse(galleryDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(galleryDefaults);
    }
  });

  test("a set without a heading is a state an author can save", () => {
    const parsed = gallerySchema.safeParse({ ...galleryDefaults, heading: undefined });
    expect(parsed.success).toBe(true);
  });

  test("one picture is not a gallery, naming the field", () => {
    const parsed = gallerySchema.safeParse({
      ...galleryDefaults,
      items: galleryDefaults.items.slice(0, 1),
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["items"]);
    }
  });

  test("nine pictures is past the set's cap, naming the field", () => {
    const nine = Array.from({ length: 9 }, (_, index) => ({
      url: `/figures/foreshore-${index}.svg`,
      alt: "The foreshore at low water",
    }));
    const parsed = gallerySchema.safeParse({ ...galleryDefaults, items: nine });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["items"]);
    }
  });

  test("a picture without alt text is refused, naming the nested path", () => {
    const [first, ...rest] = galleryDefaults.items;
    const parsed = gallerySchema.safeParse({
      ...galleryDefaults,
      items: [{ url: first?.url }, ...rest],
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["items", 0, "alt"]);
    }
  });

  test("rejects an item caption past its bound, naming the nested path", () => {
    const [first, ...rest] = galleryDefaults.items;
    const parsed = gallerySchema.safeParse({
      ...galleryDefaults,
      items: [{ ...first, caption: "a".repeat(101) }, ...rest],
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["items", 0, "caption"]);
    }
  });

  test("rejects a layout outside grid and strip, naming the field", () => {
    const parsed = gallerySchema.safeParse({ ...galleryDefaults, layout: "masonry" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["layout"]);
    }
  });
});
