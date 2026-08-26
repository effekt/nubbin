import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { BoundedTextMeta } from "./BoundedTextMeta";

test("under the bound, the counter stands alone", () => {
  render(<BoundedTextMeta max={60} length={25} />);
  expect(screen.getByText("25/60")).toBeDefined();
  expect(screen.queryByText(/Keep it under/)).toBeNull();
});

test("over the bound, the design's line appears beside the counter", () => {
  render(<BoundedTextMeta max={60} length={96} />);
  expect(screen.getByText("96/60")).toBeDefined();
  expect(screen.getByText("Keep it under 60 characters — it's 96 now.")).toBeDefined();
});
