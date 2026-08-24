import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Card } from "./Card";
import { cardDefaults } from "./cardDefaults";

describe("Card", () => {
  test("a badged card shows a visible pill, and the title links out", () => {
    render(<Card {...cardDefaults} badge="new" />);
    const link = screen.getByRole("link", {
      name: "The herring fleet waits out a third day of fog",
    });

    expect(screen.getByText("New")).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/dispatches/fog-week");
    expect(screen.getByText("Dispatches · 12 March")).toBeTruthy();
  });

  test("the updated badge reads Updated", () => {
    render(<Card {...cardDefaults} badge="updated" />);

    expect(screen.getByText("Updated")).toBeTruthy();
    expect(screen.queryByText("New")).toBeNull();
  });

  test("without a badge, no pill renders at all", () => {
    render(<Card title="Low water at noon" summary="The channel narrows to a boat's width." />);

    expect(screen.queryByText("New")).toBeNull();
    expect(screen.queryByText("Updated")).toBeNull();
  });

  test("without an href the title is plain text, never an empty link", () => {
    render(<Card title="Low water at noon" summary="The channel narrows to a boat's width." />);

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("heading", { name: "Low water at noon" }).tagName).toBe("H3");
  });
});
