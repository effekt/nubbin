import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { StatBand } from "./StatBand";
import { statBandDefaults } from "./statBandDefaults";

describe("StatBand", () => {
  test("renders every figure beside what it counts", () => {
    render(<StatBand {...statBandDefaults} />);

    for (const stat of statBandDefaults.stats) {
      expect(screen.getByText(stat.value)).toBeDefined();
      expect(screen.getByText(stat.label)).toBeDefined();
    }
  });

  test("a band with no heading still has one in the outline, unseen", () => {
    render(<StatBand stats={statBandDefaults.stats} tone="light" />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("The paper in numbers");
    expect(heading.className).toContain("sr-only");
  });

  test("the light tone swaps the dark ground's inks for the light ones", () => {
    const { container } = render(<StatBand {...statBandDefaults} tone="light" />);

    expect(container.firstElementChild?.className).toContain("bg-canvas");
    expect(container.querySelector(".text-teal")).not.toBeNull();
  });
});
