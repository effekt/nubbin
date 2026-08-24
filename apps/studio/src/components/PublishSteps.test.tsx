import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PublishSteps } from "./PublishSteps";

test("without timings every step stands pending — no invented progress", () => {
  render(<PublishSteps timings={undefined} />);
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
  expect(screen.getAllByText("…")).toHaveLength(3);
  expect(screen.queryByText(/s$/)).toBeNull();
});

test("with timings every step shows its check and the server's duration", () => {
  render(<PublishSteps timings={{ compileMs: 12, writeMs: 3, moveMs: 285 }} />);
  expect(screen.getAllByText("✓")).toHaveLength(3);
  expect(screen.getByText("Checked the page")).toBeTruthy();
  expect(screen.getAllByText("0.0s")).toHaveLength(2);
  expect(screen.getByText("0.3s")).toBeTruthy();
});
