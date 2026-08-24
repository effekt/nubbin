import { describe, expect, test } from "vitest";
import { imageFigureSchema } from "./ImageFigure.schema";
import { imageFigureDefaults } from "./imageFigureDefaults";

describe("imageFigureSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = imageFigureSchema.safeParse(imageFigureDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(imageFigureDefaults);
    }
  });

  test("a bare picture with no caption or credit is a state an author can save", () => {
    const parsed = imageFigureSchema.safeParse({
      image: imageFigureDefaults.image,
      width: "full",
    });
    expect(parsed.success).toBe(true);
  });

  test("an image without alt text is not a state an author can save", () => {
    const parsed = imageFigureSchema.safeParse({
      ...imageFigureDefaults,
      image: { url: "/figures/foreshore.svg" },
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["image", "alt"]);
    }
  });

  test("accepts a caption at the bound and rejects one past it, naming the field", () => {
    expect(
      imageFigureSchema.safeParse({ ...imageFigureDefaults, caption: "a".repeat(140) }).success,
    ).toBe(true);
    const parsed = imageFigureSchema.safeParse({
      ...imageFigureDefaults,
      caption: "a".repeat(141),
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["caption"]);
    }
  });

  test("rejects a credit past its bound, naming the field", () => {
    const parsed = imageFigureSchema.safeParse({ ...imageFigureDefaults, credit: "a".repeat(61) });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["credit"]);
    }
  });

  test("rejects a width outside the three measures, naming the field", () => {
    const parsed = imageFigureSchema.safeParse({ ...imageFigureDefaults, width: "hero" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["width"]);
    }
  });
});
