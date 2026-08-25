import { expect, test } from "vitest";
import { puckAdapter } from "./puckAdapter";

test("root fields cover DocumentMeta in contract order", () => {
  expect(Object.keys(puckAdapter.rootConfig().fields ?? {})).toStrictEqual([
    "title",
    "description",
    "robots",
    "canonical",
  ]);
});

test("only description is multi-line and every root field is labelled", () => {
  const fields = puckAdapter.rootConfig().fields ?? {};
  expect(fields.description?.type).toBe("textarea");
  for (const field of Object.values(fields)) expect(field.label).toBeTruthy();
});

test("slot fields carry allow while compile retains min and max", () => {
  expect(puckAdapter.slotField({ allow: ["Card"], min: 1, max: 12 })).toEqual({
    type: "slot",
    allow: ["Card"],
  });
  expect(puckAdapter.slotField({ min: 1, max: 3 })).toEqual({ type: "slot" });
});
