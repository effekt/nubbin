import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { NumberInputField } from "./NumberInputField";

test("edits the number and hands back undefined when emptied", () => {
  const onChange = vi.fn();
  render(
    <NumberInputField id="count" label="count" value={3} readOnly={false} onChange={onChange} />,
  );
  const input = screen.getByDisplayValue("3");
  fireEvent.change(input, { target: { value: "8" } });
  expect(onChange).toHaveBeenCalledWith(8);
  fireEvent.change(input, { target: { value: "" } });
  expect(onChange).toHaveBeenCalledWith(undefined);
});
