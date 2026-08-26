import type { FieldNode } from "@nubbin/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { ScalarFieldControl } from "./ScalarFieldControl";

function renderControl(
  field: FieldNode,
  value: unknown,
  onChange: (next: unknown) => void = () => undefined,
) {
  return render(
    <ScalarFieldControl
      field={field}
      fields={[field]}
      id="f"
      value={value}
      readOnly={false}
      onChange={onChange}
    />,
  );
}

test("a bounded string gets the counter, an unbounded one a plain input", () => {
  renderControl({ path: "r[].label", kind: "string", optional: false, maxLength: 40 }, "tide");
  expect(screen.getByText("4/40")).toBeDefined();
  const plain = renderControl({ path: "r[].href", kind: "string", optional: false }, "/x");
  expect(plain.getByDisplayValue("/x")).toBeDefined();
});

test("a number edits as a number, and clearing it hands back undefined", () => {
  const onChange = vi.fn();
  renderControl({ path: "r[].count", kind: "number", optional: false }, 3, onChange);
  const input = screen.getByDisplayValue("3");
  fireEvent.change(input, { target: { value: "7" } });
  expect(onChange).toHaveBeenCalledWith(7);
  fireEvent.change(input, { target: { value: "" } });
  expect(onChange).toHaveBeenCalledWith(undefined);
});

test("a boolean edits as a two-segment choice", () => {
  const onChange = vi.fn();
  renderControl({ path: "r[].pinned", kind: "boolean", optional: false }, true, onChange);
  fireEvent.click(screen.getByRole("radio", { name: "false" }));
  expect(onChange).toHaveBeenCalledWith(false);
});

test("an enum folds at the same size as the top level", () => {
  renderControl(
    { path: "r[].tone", kind: "enum", optional: false, members: ["light", "dark"] },
    "dark",
  );
  expect(screen.getAllByRole("radio")).toHaveLength(2);
});

test("a kind with no control shows its value read-only rather than guessing", () => {
  renderControl({ path: "r[].blob", kind: "unknown", optional: false }, { a: 1 });
  expect(screen.getByText("unknown — read-only")).toBeDefined();
});
