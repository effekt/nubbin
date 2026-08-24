import { expect, test } from "vitest";
import { toSlotField } from "./toSlotField";

test("a constrained slot carries its allow list", () => {
  expect(toSlotField({ allow: ["Card"], min: 1, max: 12 })).toEqual({
    type: "slot",
    allow: ["Card"],
  });
});

test("an unconstrained slot omits allow, which to Puck means any component", () => {
  expect(toSlotField({})).toEqual({ type: "slot" });
});

test("min and max are deliberately not forwarded — compile enforces them", () => {
  const field = toSlotField({ min: 1, max: 3 });
  expect("min" in field).toBe(false);
  expect("max" in field).toBe(false);
});
