import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Split } from "./Split";
import { splitDefaults } from "./splitDefaults";

const panes = {
  start: <p>The tide tables, corrected for the spring run</p>,
  end: <p>What the outer buoy recorded overnight</p>,
};

describe("Split", () => {
  test("renders the start pane before the end pane", () => {
    const { container } = render(<Split {...splitDefaults} {...panes} />);
    const rendered = [...container.querySelectorAll("p")].map((p) => p.textContent);

    expect(rendered).toEqual([
      "The tide tables, corrected for the spring run",
      "What the outer buoy recorded overnight",
    ]);
  });

  test.each([
    ["even", "md:grid-cols-2"],
    ["wide-start", "md:grid-cols-[2fr_1fr]"],
    ["wide-end", "md:grid-cols-[1fr_2fr]"],
  ] as const)("the %s ratio maps to %s, and only from md up", (ratio, expected) => {
    const { container } = render(<Split ratio={ratio} {...panes} />);
    const grid = container.querySelector(".grid");
    const classes = grid?.className.split(/\s+/) ?? [];

    expect(classes).toContain(expected);
    // Below the breakpoint the panes stack: every column class carries the md: prefix.
    for (const token of classes) {
      if (token.includes("grid-cols")) expect(token.startsWith("md:")).toBe(true);
    }
  });

  test("without a tone it inherits the surrounding surface", () => {
    const { container } = render(<Split {...splitDefaults} {...panes} />);
    const section = container.querySelector("section");

    expect(section?.className.includes("bg-")).toBe(false);
  });

  test("a dark tone paints the dark surface", () => {
    const { container } = render(<Split ratio="even" tone="dark" {...panes} />);

    expect(container.querySelector("section")?.className).toContain("bg-marine");
  });
});
