import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { LogoWall } from "./LogoWall";
import { logoWallDefaults } from "./logoWallDefaults";

describe("LogoWall", () => {
  test("a mark without an image renders as set text, never an empty box", () => {
    const { container } = render(<LogoWall {...logoWallDefaults} />);

    for (const item of logoWallDefaults.items) {
      expect(screen.getByText(item.name)).toBeDefined();
    }
    expect(container.querySelector("img")).toBeNull();
  });

  test("a mark with an image draws it, spoken by the mark's own name", () => {
    render(
      <LogoWall
        heading={logoWallDefaults.heading}
        items={[{ name: "Oare Marshes Wardens", imageUrl: "/hero-pricing.svg" }, { name: "Text" }]}
      />,
    );

    expect(screen.getByRole("img", { name: "Oare Marshes Wardens" })).toBeDefined();
  });

  test("a wall with no heading still has one in the outline, unseen", () => {
    render(<LogoWall items={logoWallDefaults.items} />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Who carries the paper");
    expect(heading.className).toContain("sr-only");
  });
});
