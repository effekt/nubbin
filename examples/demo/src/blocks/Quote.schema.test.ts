import { describe, expect, test } from "vitest";
import { quoteSchema } from "./Quote.schema";
import { quoteDefaults } from "./quoteDefaults";

describe("quoteSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = quoteSchema.safeParse(quoteDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(quoteDefaults);
    }
  });

  test("accepts text at the bound and rejects text past it, naming the field", () => {
    expect(quoteSchema.safeParse({ ...quoteDefaults, text: "a".repeat(240) }).success).toBe(true);
    const parsed = quoteSchema.safeParse({ ...quoteDefaults, text: "a".repeat(241) });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["text"]);
    }
  });

  test("a voice without a role is a state an author can save", () => {
    const parsed = quoteSchema.safeParse({
      ...quoteDefaults,
      attribution: { name: "A reader in Seasalter" },
    });
    expect(parsed.success).toBe(true);
  });

  test("rejects an attribution name past its bound, naming the nested path", () => {
    const parsed = quoteSchema.safeParse({
      ...quoteDefaults,
      attribution: { name: "a".repeat(61) },
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["attribution", "name"]);
    }
  });

  test("rejects a tone outside the demo's two grounds, naming the field", () => {
    const parsed = quoteSchema.safeParse({ ...quoteDefaults, tone: "sepia" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["tone"]);
    }
  });
});
