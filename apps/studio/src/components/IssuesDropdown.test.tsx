import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { IssuesDropdown } from "./IssuesDropdown";

const issues = [
  { nodeId: "hero", blockName: "Hero", fieldLabel: "Headline", message: "over the limit" },
  { message: "route already live" },
];

test("titles itself with the count and lists one row per issue", () => {
  render(<IssuesDropdown issues={issues} onGoTo={() => undefined} />);
  expect(
    screen.getByRole("heading", { name: "2 things need fixing before this can go live" }),
  ).toBeDefined();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});

test("carries the footer reassurance in the design's words", () => {
  render(<IssuesDropdown issues={issues} onGoTo={() => undefined} />);
  expect(screen.getByText(/Your work is saved as-is\./)).toBeDefined();
  expect(screen.getByText(/nothing goes live by accident\./)).toBeDefined();
});
