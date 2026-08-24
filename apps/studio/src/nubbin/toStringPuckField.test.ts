import { expect, test } from "vitest";
import { toStringPuckField } from "./toStringPuckField";

test("a bounded string becomes the bounded custom control", () => {
  const field = toStringPuckField({ path: "f", kind: "string", optional: false, maxLength: 60 });
  expect(field.type).toBe("custom");
});

test("an unbounded string stays the stock text field", () => {
  expect(toStringPuckField({ path: "f", kind: "string", optional: false })).toEqual({
    type: "text",
    label: "f",
  });
});
