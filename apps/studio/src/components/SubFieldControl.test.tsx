import { zodAdapter } from "@nubbin/core";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { z } from "zod";
import { SubFieldControl } from "./SubFieldControl";

const schema = z.object({
  items: z.array(
    z.object({
      name: z.string().max(40),
      badge: z.object({ text: z.string() }),
      tags: z.array(z.string()),
    }),
  ),
});
const fields = zodAdapter.describe(schema);
const at = (path: string) => {
  const field = fields.find((node) => node.path === path);
  if (field === undefined) throw new Error(`no described field at ${path}`);
  return field;
};

function renderControl(path: string, value: unknown) {
  return render(
    <SubFieldControl
      field={at(path)}
      fields={fields}
      id="sub"
      value={value}
      readOnly={false}
      onChange={() => undefined}
    />,
  );
}

test("an object child becomes a labelled fieldset over its own fields", () => {
  renderControl("items[].badge", { text: "new" });
  expect(screen.getByText("badge")).toBeDefined();
  expect(screen.getByDisplayValue("new")).toBeDefined();
});

test("an array child becomes a nested repeater", () => {
  renderControl("items[].tags", ["tide", "moon"]);
  expect(screen.getByRole("button", { name: "+ Add" })).toBeDefined();
  expect(screen.getByRole("button", { name: "tide" })).toBeDefined();
});

test("a scalar child renders the per-kind control, bound included", () => {
  renderControl("items[].name", "Ledd & Co.");
  expect(screen.getByDisplayValue("Ledd & Co.")).toBeDefined();
  expect(screen.getByText("10/40")).toBeDefined();
});
