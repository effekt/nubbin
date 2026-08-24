import { type FieldNode, zodAdapter } from "@nubbin/core";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { z } from "zod";
import { richTextFieldNodes } from "../nubbin/richTextFieldNodes";
import { toHintedFields } from "../nubbin/toHintedFields";
import { ConsumerOriginContext } from "./ConsumerOriginContext";
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

test("a nested rich-text array becomes the rich-text control, not a repeater", () => {
  const richFields: FieldNode[] = [
    { path: "note", kind: "object", optional: false },
    { path: "note.body", kind: "array", optional: false },
    ...richTextFieldNodes.map((held) => ({ ...held, path: `note.body${held.path}` })),
  ];
  render(
    <SubFieldControl
      field={richFields[1] as FieldNode}
      fields={richFields}
      id="sub"
      value={[{ kind: "paragraph", spans: [{ text: "nested prose" }] }]}
      readOnly={false}
      onChange={() => undefined}
    />,
  );
  expect(screen.getByRole("toolbar", { name: "Text style" })).toBeDefined();
  expect(screen.getByDisplayValue("nested prose")).toBeDefined();
});

test("a link-hinted string nested in a fieldset renders the link control", () => {
  const ctaSchema = z.object({ cta: z.object({ label: z.string(), href: z.string() }) });
  const hinted = toHintedFields(zodAdapter.describe(ctaSchema), {
    fields: { "cta.href": { control: "link" } },
  });
  const cta = hinted.find((node) => node.path === "cta");
  if (cta === undefined) throw new Error("no described field at cta");
  render(
    <ConsumerOriginContext.Provider value="http://localhost:3100">
      <SubFieldControl
        field={cta}
        fields={hinted}
        id="sub"
        value={{ label: "Read more", href: "/dispatches" }}
        readOnly={false}
        onChange={() => undefined}
      />
    </ConsumerOriginContext.Provider>,
  );
  expect(
    screen.getByRole("link", { name: "Open http://localhost:3100/dispatches in a new tab" }),
  ).toBeDefined();
});
