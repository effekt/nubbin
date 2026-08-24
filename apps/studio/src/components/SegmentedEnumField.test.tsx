import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { SegmentedEnumField } from "./SegmentedEnumField";

function renderSegments(value: string | undefined, onChange: (next: string) => void = () => 0) {
  return render(
    <SegmentedEnumField
      id="tone"
      label="tone"
      members={["light", "dark"]}
      value={value}
      readOnly={false}
      onChange={onChange}
    />,
  );
}

test("each member is a real radio in one named group, the value checked", () => {
  renderSegments("dark");
  const group = screen.getByRole("group", { name: "tone" });
  expect(group).toBeDefined();
  const radios = screen.getAllByRole("radio");
  expect(radios).toHaveLength(2);
  expect(screen.getByRole("radio", { name: "light" })).toHaveProperty("checked", false);
  expect(screen.getByRole("radio", { name: "dark" })).toHaveProperty("checked", true);
});

test("choosing a segment commits its member value", () => {
  const onChange = vi.fn();
  renderSegments("dark", onChange);
  fireEvent.click(screen.getByRole("radio", { name: "light" }));
  expect(onChange).toHaveBeenCalledWith("light");
});

test("an undefined value checks nothing rather than guessing a member", () => {
  renderSegments(undefined);
  for (const radio of screen.getAllByRole("radio")) {
    expect(radio).toHaveProperty("checked", false);
  }
});

test("read-only disables every segment", () => {
  render(
    <SegmentedEnumField
      id="tone"
      label="tone"
      members={["light", "dark"]}
      value="dark"
      readOnly={true}
      onChange={() => 0}
    />,
  );
  for (const radio of screen.getAllByRole("radio")) {
    expect(radio).toHaveProperty("disabled", true);
  }
});
