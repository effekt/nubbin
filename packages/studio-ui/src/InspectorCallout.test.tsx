import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { InspectorCallout } from "./InspectorCallout";

test("speaks the design's line for the selected block", () => {
  render(<InspectorCallout blockName="Hero" count={2} />);
  expect(screen.getByRole("status").textContent).toBe(
    "Hero has 2 things to fix. Your edits are saved — the page just can't go live until they're resolved.",
  );
});
