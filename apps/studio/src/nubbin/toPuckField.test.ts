import type { FieldNode } from "@nubbin/core";
import { richTextFieldNodes } from "@nubbin/studio-ui";
import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { expect, test } from "vitest";
import { toPuckField } from "./toPuckField";

const node = (kind: FieldNode["kind"], members?: readonly string[]): FieldNode =>
  members === undefined
    ? { path: "field", kind, optional: false }
    : { path: "field", kind, optional: false, members };

test("string becomes a text field", () => {
  expect(toPuckField(node("string"), [])).toEqual({ type: "text", label: "field" });
});

test("a string the schema bounds becomes the bounded custom control", () => {
  const field = toPuckField({ path: "field", kind: "string", optional: false, maxLength: 60 }, []);
  expect(field.type).toBe("custom");
  expect(field.label).toBe("field");
});

test("number becomes a number field", () => {
  expect(toPuckField(node("number"), [])).toEqual({ type: "number", label: "field" });
});

test("boolean becomes a radio over true and false", () => {
  expect(toPuckField(node("boolean"), [])).toEqual({
    type: "radio",
    label: "field",
    options: [
      { label: "true", value: true },
      { label: "false", value: false },
    ],
  });
});

test("an enum of up to three members becomes the segmented custom control", () => {
  for (const members of [
    ["light", "dark"],
    ["left", "center", "right"],
  ] as const) {
    const field = toPuckField(node("enum", members), []);
    expect(field.type).toBe("custom");
    expect(field.label).toBe("field");
  }
});

test("an enum past three members stays a select over them", () => {
  expect(toPuckField(node("enum", ["a", "b", "c", "d"]), [])).toEqual({
    type: "select",
    label: "field",
    options: [
      { label: "a", value: "a" },
      { label: "b", value: "b" },
      { label: "c", value: "c" },
      { label: "d", value: "d" },
    ],
  });
});

test("an enum with no members stays a select rather than an empty segment row", () => {
  expect(toPuckField(node("enum", []), [])).toEqual({
    type: "select",
    label: "field",
    options: [],
  });
});

test("an array whose row shape is described becomes the repeater custom field", () => {
  const arrayField: FieldNode = {
    path: "field",
    kind: "array",
    optional: false,
    minItems: 2,
    maxItems: 4,
  };
  const fields: FieldNode[] = [
    arrayField,
    { path: "field[]", kind: "object", optional: false },
    { path: "field[].label", kind: "string", optional: false },
  ];
  const built = toPuckField(arrayField, fields);
  expect(built.type).toBe("custom");
  expect(built.label).toBe("field");
});

test("an object with described children becomes the fieldset custom field", () => {
  const objectField: FieldNode = { path: "field", kind: "object", optional: false };
  const fields: FieldNode[] = [
    objectField,
    { path: "field.name", kind: "string", optional: false },
  ];
  const built = toPuckField(objectField, fields);
  expect(built.type).toBe("custom");
  expect(built.label).toBe("field");
});

test("every kind the description cannot reach into falls back to the read-only custom field", () => {
  for (const kind of ["array", "object", "union", "unknown"] as const) {
    expect(toPuckField(node(kind), []).type).toBe("custom");
  }
});

test("an array whose described shape is core's rich text becomes the rich-text control", () => {
  const arrayField: FieldNode = { path: "body", kind: "array", optional: false };
  const fields: FieldNode[] = [
    arrayField,
    ...richTextFieldNodes.map((held) => ({ ...held, path: `body${held.path}` })),
  ];
  const built = toPuckField(arrayField, fields);
  expect(built.type).toBe("custom");
  expect(built.label).toBe("body");
  if (built.type !== "custom") return;
  render(
    createElement(built.render, {
      id: "body",
      name: "body",
      field: built,
      value: [],
      onChange: () => 0,
    }),
  );
  expect(screen.getByRole("toolbar", { name: "Text style" })).toBeDefined();
});
