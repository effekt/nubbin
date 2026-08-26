import { expect, test } from "vitest";
import { rollbackLabel } from "./rollbackLabel";

test("resting, it offers the roll back", () => {
  expect(rollbackLabel(false, false)).toBe("Roll back");
});

test("confirming, it asks for the second press", () => {
  expect(rollbackLabel(true, false)).toBe("Confirm roll back");
});

test("pending wins over confirming", () => {
  expect(rollbackLabel(true, true)).toBe("Rolling back…");
});
