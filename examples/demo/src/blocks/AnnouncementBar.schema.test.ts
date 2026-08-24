import { describe, expect, test } from "vitest";
import { announcementBarSchema } from "./AnnouncementBar.schema";
import { announcementBarDefaults } from "./announcementBarDefaults";

describe("announcementBarSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = announcementBarSchema.safeParse(announcementBarDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(announcementBarDefaults);
    }
  });

  test("accepts text at the bound and rejects text past it, naming the field", () => {
    expect(
      announcementBarSchema.safeParse({ ...announcementBarDefaults, text: "a".repeat(90) }).success,
    ).toBe(true);
    const parsed = announcementBarSchema.safeParse({
      ...announcementBarDefaults,
      text: "a".repeat(91),
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["text"]);
    }
  });

  test("accepts a notice that goes nowhere", () => {
    const { href, ...standing } = announcementBarDefaults;
    expect(announcementBarSchema.safeParse(standing).success).toBe(true);
  });

  test("rejects a tone outside the closed set", () => {
    expect(
      announcementBarSchema.safeParse({ ...announcementBarDefaults, tone: "orange" }).success,
    ).toBe(false);
  });
});
