import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { BoundedTextField } from "./BoundedTextField";

function renderField(value: string, onChange: (next: string) => void = () => undefined) {
  return render(
    <BoundedTextField
      id="headline"
      label="headline"
      max={60}
      value={value}
      readOnly={false}
      onChange={onChange}
    />,
  );
}

test("counts live under the bound, with no message in the way", () => {
  renderField("The water tells you first");
  expect(screen.getByText("25/60")).toBeDefined();
  expect(screen.queryByText(/Keep it under/)).toBeNull();
});

test("over the bound, the design's line appears beside the counter", () => {
  renderField("x".repeat(96));
  expect(screen.getByText("96/60")).toBeDefined();
  expect(screen.getByText("Keep it under 60 characters — it's 96 now.")).toBeDefined();
});

test("typing past the bound still saves — display only, publish is the gate", () => {
  const onChange = vi.fn();
  renderField("x".repeat(60), onChange);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "x".repeat(61) } });
  expect(onChange).toHaveBeenCalledWith("x".repeat(61));
});

test("an undefined value reads as empty rather than crashing the counter", () => {
  render(
    <BoundedTextField
      id="headline"
      label="headline"
      max={60}
      value={undefined}
      readOnly={false}
      onChange={() => undefined}
    />,
  );
  expect(screen.getByText("0/60")).toBeDefined();
});
