import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CardGrid } from "./CardGrid";
import { cardGridDefaults } from "./cardGridDefaults";

const cards = <article>A week of small harbours</article>;

describe("CardGrid", () => {
  test("renders the heading over the slot children", () => {
    render(<CardGrid {...cardGridDefaults} cards={cards} />);

    expect(screen.getByRole("heading", { name: "Latest from the field" }).tagName).toBe("H2");
    expect(screen.getByText("A week of small harbours")).toBeTruthy();
  });

  test("renders no heading element when the heading is omitted", () => {
    render(<CardGrid columns="two" cards={cards} />);

    expect(screen.queryByRole("heading")).toBeNull();
  });

  test.each([
    ["two", false],
    ["three", true],
  ] as const)("the %s column count widens to three columns: %s", (columns, widens) => {
    const { container } = render(<CardGrid columns={columns} cards={cards} />);
    const grid = container.querySelector(".grid");

    expect(grid?.className.includes("lg:grid-cols-3")).toBe(widens);
  });
});
