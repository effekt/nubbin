import { zodAdapter } from "@nubbin/core";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { z } from "zod";
import { RepeaterRowBody } from "./RepeaterRowBody";
import { SubFieldControl } from "./SubFieldControl";

const objectRows = zodAdapter.describe(
  z.object({ items: z.array(z.object({ name: z.string() })) }),
);
const scalarRows = zodAdapter.describe(z.object({ tags: z.array(z.string()) }));
const shapeOf = (fields: typeof objectRows, path: string) => {
  const shape = fields.find((field) => field.path === path);
  if (shape === undefined) throw new Error(`no row shape at ${path}`);
  return shape;
};

test("an object row is an unlabelled fieldset over its own fields", () => {
  const fields = objectRows;
  render(
    <RepeaterRowBody
      id="row"
      row={{ name: "Ledd & Co." }}
      rowShape={shapeOf(fields, "items[]")}
      childFields={fields.filter((field) => field.path === "items[].name")}
      fields={fields}
      readOnly={false}
      onChange={() => undefined}
      renderField={SubFieldControl}
    />,
  );
  expect(screen.getByDisplayValue("Ledd & Co.")).toBeDefined();
  expect(screen.queryByText("items")).toBeNull();
});

test("a scalar row is a single control editing the row itself", () => {
  render(
    <RepeaterRowBody
      id="row"
      row="tide"
      rowShape={shapeOf(scalarRows, "tags[]")}
      childFields={[]}
      fields={scalarRows}
      readOnly={false}
      onChange={() => undefined}
      renderField={SubFieldControl}
    />,
  );
  expect(screen.getByDisplayValue("tide")).toBeDefined();
});
