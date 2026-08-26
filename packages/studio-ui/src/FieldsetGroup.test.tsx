import { readFileSync } from "node:fs";
import { zodAdapter } from "@nubbin/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { z } from "zod";
import { FieldsetGroup } from "./FieldsetGroup";
import { SubFieldControl } from "./SubFieldControl";

const schema = z.object({
  attribution: z.object({ name: z.string().max(60), role: z.string().max(80).optional() }),
});
const fields = zodAdapter.describe(schema);
const children = fields.filter((field) => field.path.startsWith("attribution."));

function renderGroup(value: unknown, onChange: (next: Record<string, unknown>) => void) {
  return render(
    <FieldsetGroup
      id="attribution"
      label="attribution"
      fields={children}
      allFields={fields}
      value={value}
      readOnly={false}
      onChange={onChange}
      renderField={SubFieldControl}
    />,
  );
}

test("recurses per sub-field with the same per-kind controls, counters included", () => {
  renderGroup({ name: "Edda Voss", role: "harbourmaster" }, () => undefined);
  expect(screen.getByText("attribution")).toBeDefined();
  expect(screen.getByDisplayValue("Edda Voss")).toBeDefined();
  expect(screen.getByText("9/60")).toBeDefined();
  expect(screen.getByText("13/80")).toBeDefined();
});

test("an edited sub-field writes back into a copy of the object", () => {
  const onChange = vi.fn();
  renderGroup({ name: "Edda Voss", role: "harbourmaster" }, onChange);
  fireEvent.change(screen.getByDisplayValue("Edda Voss"), { target: { value: "Mari Holt" } });
  expect(onChange).toHaveBeenCalledWith({ name: "Mari Holt", role: "harbourmaster" });
});

test("an absent object edits as an empty one and grows keys as the author types", () => {
  const onChange = vi.fn();
  renderGroup(undefined, onChange);
  const inputs = screen.getAllByRole("textbox");
  fireEvent.change(inputs[0] as Element, { target: { value: "E" } });
  expect(onChange).toHaveBeenCalledWith({ name: "E" });
});

test("the fieldset container Go-to-it lands on carries an explicit :focus ring", () => {
  const css = readFileSync("src/repeaterField.css", "utf8");
  const rule = css.match(/^\.nb-repeater:focus,\n\.nb-fieldset:focus \{[^}]*\}/m);
  expect(rule?.[0]).toContain("outline: 2px solid var(--nb-teal)");
});
