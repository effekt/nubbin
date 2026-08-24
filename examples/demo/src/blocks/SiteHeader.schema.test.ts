import { describe, expect, test } from "vitest";
import { siteHeaderSchema } from "./SiteHeader.schema";
import { siteHeaderDefaults } from "./siteHeaderDefaults";

describe("siteHeaderSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = siteHeaderSchema.safeParse(siteHeaderDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(siteHeaderDefaults);
    }
  });

  test("rejects a header with no links, which is a masthead with nowhere to go", () => {
    expect(siteHeaderSchema.safeParse({ ...siteHeaderDefaults, links: [] }).success).toBe(false);
  });

  test("rejects a seventh link", () => {
    const link = { label: "More", href: "/#" };
    const links = Array.from({ length: 7 }, () => link);
    expect(siteHeaderSchema.safeParse({ ...siteHeaderDefaults, links }).success).toBe(false);
  });

  test("rejects a label past the width one header row carries", () => {
    const links = [{ label: "Everything the paper has printed since 1907", href: "/dispatches" }];
    expect(siteHeaderSchema.safeParse({ ...siteHeaderDefaults, links }).success).toBe(false);
  });

  test("rejects a tone outside the closed pair", () => {
    expect(siteHeaderSchema.safeParse({ ...siteHeaderDefaults, tone: "brand" }).success).toBe(
      false,
    );
  });
});
