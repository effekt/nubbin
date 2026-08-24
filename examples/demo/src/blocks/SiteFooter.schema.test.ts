import { describe, expect, test } from "vitest";
import { siteFooterSchema } from "./SiteFooter.schema";
import { siteFooterDefaults } from "./siteFooterDefaults";

describe("siteFooterSchema", () => {
  test("the defaults validate to the same value, unchanged", () => {
    const parsed = siteFooterSchema.safeParse(siteFooterDefaults);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(siteFooterDefaults);
    }
  });

  test("rejects a fourth column, naming the field", () => {
    const extra = { heading: "More", links: [{ label: "Archive", href: "/#" }] };
    const columns = [...siteFooterDefaults.columns, extra];
    const parsed = siteFooterSchema.safeParse({ ...siteFooterDefaults, columns });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["columns"]);
    }
  });

  test("rejects a tone outside the closed set", () => {
    expect(siteFooterSchema.safeParse({ ...siteFooterDefaults, tone: "sepia" }).success).toBe(
      false,
    );
  });
});
