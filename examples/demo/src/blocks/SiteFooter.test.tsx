import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { SiteFooter } from "./SiteFooter";
import { siteFooterDefaults } from "./siteFooterDefaults";

describe("SiteFooter", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // The fixture legitimately points several placeholder links at one target, so an href is
  // content, not identity — two links sharing one must not collide as React keys.
  test("two links sharing an href render without a duplicate-key warning", () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const columns = [
      {
        heading: "The paper",
        links: [
          { label: "Corrections", href: "/#" },
          { label: "Contact", href: "/#" },
        ],
      },
    ];

    render(<SiteFooter {...siteFooterDefaults} columns={columns} />);

    expect(screen.getByRole("link", { name: "Corrections" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Contact" })).toBeDefined();
    const logged = errors.mock.calls.map((call) => call.join(" ")).join("\n");
    expect(logged).not.toContain("same key");
  });

  test("renders the tagline, every column heading, and the legal line", () => {
    render(<SiteFooter {...siteFooterDefaults} />);

    expect(screen.getByText(siteFooterDefaults.tagline)).toBeDefined();
    for (const column of siteFooterDefaults.columns) {
      expect(screen.getByRole("heading", { name: column.heading })).toBeDefined();
    }
    expect(screen.getByText(siteFooterDefaults.legal)).toBeDefined();
  });
});
