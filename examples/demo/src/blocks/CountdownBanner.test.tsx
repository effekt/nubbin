import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CountdownBanner } from "./CountdownBanner";
import { countdownBannerDefaults } from "./countdownBannerDefaults";

describe("CountdownBanner", () => {
  test("renders the text beside the formatted moment", () => {
    render(<CountdownBanner {...countdownBannerDefaults} />);

    expect(screen.getByText(countdownBannerDefaults.text)).toBeDefined();
    expect(screen.getByText("22 September at 05:41")).toBeDefined();
  });

  test("the moment stays machine-readable on a time element", () => {
    const { container } = render(<CountdownBanner {...countdownBannerDefaults} />);

    expect(container.querySelector("time")?.getAttribute("datetime")).toBe(
      countdownBannerDefaults.deadline,
    );
  });

  test("the bar is a named landmark a screen reader can jump to", () => {
    render(<CountdownBanner {...countdownBannerDefaults} />);

    expect(screen.getByRole("complementary", { name: "Countdown" })).toBeDefined();
  });
});
