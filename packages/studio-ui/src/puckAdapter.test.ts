import { expect, test } from "vitest";
import { puckAdapter } from "./puckAdapter";

test("root fields cover document metadata in contract order", () => {
  expect(Object.keys(puckAdapter.rootConfig().fields ?? {})).toStrictEqual([
    "title",
    "description",
    "robots",
    "canonical",
  ]);
});

test("slot fields carry allow while compile retains cardinality", () => {
  expect(puckAdapter.slotField({ allow: ["Card"], min: 1, max: 12 })).toEqual({
    type: "slot",
    allow: ["Card"],
  });
  expect(puckAdapter.slotField({ min: 1, max: 3 })).toEqual({ type: "slot" });
});
