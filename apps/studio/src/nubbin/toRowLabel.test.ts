import type { FieldNode } from "@nubbin/core";
import { expect, test } from "vitest";
import { toRowLabel } from "./toRowLabel";

const statChildren: FieldNode[] = [
  { path: "stats[].value", kind: "string", optional: false, maxLength: 12 },
  { path: "stats[].label", kind: "string", optional: false, maxLength: 40 },
];

test("an object row is labelled by its first string field's value", () => {
  expect(toRowLabel({ value: "6", label: "springs mapped" }, statChildren)).toBe("6");
});

test("a scalar row is its own label", () => {
  expect(toRowLabel("Fast shipping", [])).toBe("Fast shipping");
});

test("an empty or missing label comes back undefined for the untitled state", () => {
  expect(toRowLabel({ value: "   ", label: "x" }, statChildren)).toBeUndefined();
  expect(toRowLabel({}, statChildren)).toBeUndefined();
  expect(toRowLabel("  ", [])).toBeUndefined();
  expect(toRowLabel(7, statChildren)).toBeUndefined();
});

test("a row with no string field to speak through stays untitled", () => {
  const children: FieldNode[] = [{ path: "rows[].count", kind: "number", optional: false }];
  expect(toRowLabel({ count: 3 }, children)).toBeUndefined();
});
