import { expect, test } from "vitest";
import { asStringValue } from "./asStringValue";

test("passes a string through and turns anything else into undefined", () => {
  expect(asStringValue("tide")).toBe("tide");
  expect(asStringValue(7)).toBeUndefined();
  expect(asStringValue(undefined)).toBeUndefined();
  expect(asStringValue({ a: 1 })).toBeUndefined();
});
