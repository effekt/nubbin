import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PlainTextField } from "./PlainTextField";

test("edits the string and reads undefined as empty", () => {
  const onChange = vi.fn();
  render(
    <PlainTextField
      id="href"
      label="href"
      value={undefined}
      readOnly={false}
      onChange={onChange}
    />,
  );
  const input = screen.getByRole("textbox");
  expect((input as HTMLInputElement).value).toBe("");
  fireEvent.change(input, { target: { value: "/dispatches" } });
  expect(onChange).toHaveBeenCalledWith("/dispatches");
});
