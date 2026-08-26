import { expect, test } from "vitest";
import { publishLabel } from "./publishLabel";

test("a draft ahead of the pointer offers to publish the changes", () => {
  expect(publishLabel(false)).toBe("Publish changes");
});

test("a landed publish says so", () => {
  expect(publishLabel(true)).toBe("Published ✓");
});
