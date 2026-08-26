import { expect, test } from "vitest";
import { toEnumPuckField } from "./toEnumPuckField";

test("up to three members become the segmented custom control", () => {
  const field = toEnumPuckField({
    path: "f",
    kind: "enum",
    optional: false,
    members: ["light", "dark"],
  });
  expect(field.type).toBe("custom");
});

test("past three members, or none, it stays a select", () => {
  const wide = toEnumPuckField({
    path: "f",
    kind: "enum",
    optional: false,
    members: ["a", "b", "c", "d"],
  });
  expect(wide.type).toBe("select");
  expect(toEnumPuckField({ path: "f", kind: "enum", optional: false }).type).toBe("select");
});
