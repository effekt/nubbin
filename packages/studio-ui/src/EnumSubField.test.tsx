import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { EnumSubField } from "./EnumSubField";

test("up to three members lay flat as segments", () => {
  render(
    <EnumSubField
      id="tone"
      label="tone"
      members={["light", "dark"]}
      value="dark"
      readOnly={false}
      onChange={() => undefined}
    />,
  );
  expect(screen.getAllByRole("radio")).toHaveLength(2);
});

test("past three members it folds into a dropdown that still edits", () => {
  const onChange = vi.fn();
  render(
    <EnumSubField
      id="pick"
      label="pick"
      members={["a", "b", "c", "d"]}
      value="a"
      readOnly={false}
      onChange={onChange}
    />,
  );
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "c" } });
  expect(onChange).toHaveBeenCalledWith("c");
});
