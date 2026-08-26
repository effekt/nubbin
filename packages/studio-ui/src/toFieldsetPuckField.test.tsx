import { zodAdapter } from "@nubbin/core";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { z } from "zod";
import { toFieldsetPuckField } from "./toFieldsetPuckField";

const fields = zodAdapter.describe(
  z.object({ attribution: z.object({ name: z.string().max(60) }) }),
);
const attributionField = fields.find((field) => field.path === "attribution");
if (attributionField === undefined) throw new Error("the description lost the attribution field");

test("builds a custom field labelled by the path whose render is the fieldset", () => {
  const field = toFieldsetPuckField(attributionField, fields);
  expect(field.type).toBe("custom");
  expect(field.label).toBe("attribution");
  render(
    field.render({
      id: "attribution",
      name: "attribution",
      field,
      value: { name: "Edda Voss" },
      onChange: () => undefined,
    }),
  );
  expect(screen.getByText("attribution")).toBeDefined();
  expect(screen.getByDisplayValue("Edda Voss")).toBeDefined();
  expect(screen.getByText("9/60")).toBeDefined();
});
