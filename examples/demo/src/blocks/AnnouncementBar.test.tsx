import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AnnouncementBar } from "./AnnouncementBar";
import { announcementBarDefaults } from "./announcementBarDefaults";

describe("AnnouncementBar", () => {
  test("with an href the whole line is an underlined link", () => {
    render(<AnnouncementBar {...announcementBarDefaults} />);
    const link = screen.getByRole("link", { name: announcementBarDefaults.text });

    expect(link.getAttribute("href")).toBe(announcementBarDefaults.href);
    expect(link.className).toContain("underline");
  });

  test("without an href the line stands as plain text, not a dead link", () => {
    render(<AnnouncementBar {...announcementBarDefaults} href={undefined} />);

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(announcementBarDefaults.text)).toBeDefined();
  });

  test.each([
    ["notice", "bg-marine"],
    ["urgent", "bg-orange-deep"],
  ] as const)("the %s tone paints the %s ground", (tone, expected) => {
    const { container } = render(<AnnouncementBar {...announcementBarDefaults} tone={tone} />);

    expect(container.querySelector("aside")?.className).toContain(expected);
  });

  test("the bar is a named landmark a screen reader can jump to", () => {
    render(<AnnouncementBar {...announcementBarDefaults} />);

    expect(screen.getByRole("complementary", { name: "Announcement" })).toBeDefined();
  });
});
