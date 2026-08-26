import type { FieldNode } from "@nubbin/core";
import { expect, test } from "vitest";
import { rowFieldOf } from "./rowFieldOf";

const fields: FieldNode[] = [
  { path: "stats", kind: "array", optional: false },
  { path: "stats[]", kind: "object", optional: false },
  { path: "stats[].label", kind: "string", optional: false },
];

test("finds the row shape the description emitted at path[]", () => {
  expect(rowFieldOf(fields, "stats")).toEqual({ path: "stats[]", kind: "object", optional: false });
});

test("comes back empty when the description never descended into the array", () => {
  expect(rowFieldOf(fields, "items")).toBeUndefined();
});
