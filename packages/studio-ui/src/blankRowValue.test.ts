import type { FieldNode } from "@nubbin/core";
import { expect, test } from "vitest";
import { blankRowValue } from "./blankRowValue";

test("blanks each scalar kind to the emptiest thing it can be", () => {
  expect(blankRowValue({ path: "p", kind: "string", optional: false }, [])).toBe("");
  expect(blankRowValue({ path: "p", kind: "number", optional: false }, [])).toBe(0);
  expect(blankRowValue({ path: "p", kind: "boolean", optional: false }, [])).toBe(false);
  expect(blankRowValue({ path: "p", kind: "array", optional: false }, [])).toEqual([]);
});

test("an enum blanks to its first member", () => {
  const field: FieldNode = { path: "p", kind: "enum", optional: false, members: ["light", "dark"] };
  expect(blankRowValue(field, [])).toBe("light");
});

test("an object row carries its required fields blanked and leaves optional ones out", () => {
  const rowShape: FieldNode = { path: "items[]", kind: "object", optional: false };
  const fields: FieldNode[] = [
    rowShape,
    { path: "items[].name", kind: "string", optional: false, maxLength: 40 },
    { path: "items[].imageUrl", kind: "string", optional: true },
  ];
  expect(blankRowValue(rowShape, fields)).toEqual({ name: "" });
});

test("a kind with no blank stays undefined rather than guessing", () => {
  expect(blankRowValue({ path: "p", kind: "union", optional: false }, [])).toBeUndefined();
  expect(blankRowValue({ path: "p", kind: "unknown", optional: false }, [])).toBeUndefined();
});
