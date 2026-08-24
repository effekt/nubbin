import type { FieldNode } from "@nubbin/core";
import { expect, test } from "vitest";
import { toPuckField } from "./toPuckField";

const node = (kind: FieldNode["kind"], members?: readonly string[]): FieldNode =>
  members === undefined
    ? { path: "field", kind, optional: false }
    : { path: "field", kind, optional: false, members };

test("string becomes a text field", () => {
  expect(toPuckField(node("string"))).toEqual({ type: "text", label: "field" });
});

test("a string the schema bounds becomes the bounded custom control", () => {
  const field = toPuckField({ path: "field", kind: "string", optional: false, maxLength: 60 });
  expect(field.type).toBe("custom");
  expect(field.label).toBe("field");
});

test("number becomes a number field", () => {
  expect(toPuckField(node("number"))).toEqual({ type: "number", label: "field" });
});

test("boolean becomes a radio over true and false", () => {
  expect(toPuckField(node("boolean"))).toEqual({
    type: "radio",
    label: "field",
    options: [
      { label: "true", value: true },
      { label: "false", value: false },
    ],
  });
});

test("enum becomes a select over its members", () => {
  expect(toPuckField(node("enum", ["light", "dark"]))).toEqual({
    type: "select",
    label: "field",
    options: [
      { label: "light", value: "light" },
      { label: "dark", value: "dark" },
    ],
  });
});

test("every other kind falls back to the read-only custom field", () => {
  for (const kind of ["array", "object", "union", "unknown"] as const) {
    expect(toPuckField(node(kind)).type).toBe("custom");
  }
});
