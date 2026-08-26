import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { BooleanSubField } from "./BooleanSubField";

test("shows the held boolean and hands back a real one", () => {
  const onChange = vi.fn();
  render(
    <BooleanSubField
      id="pinned"
      label="pinned"
      value={false}
      readOnly={false}
      onChange={onChange}
    />,
  );
  const yes = screen.getByRole("radio", { name: "true" });
  expect((screen.getByRole("radio", { name: "false" }) as HTMLInputElement).checked).toBe(true);
  fireEvent.click(yes);
  expect(onChange).toHaveBeenCalledWith(true);
});

test("a non-boolean value leaves neither segment claimed", () => {
  render(
    <BooleanSubField
      id="pinned"
      label="pinned"
      value={undefined}
      readOnly={false}
      onChange={() => undefined}
    />,
  );
  const checked = screen
    .getAllByRole("radio")
    .filter((radio) => (radio as HTMLInputElement).checked);
  expect(checked).toHaveLength(0);
});
