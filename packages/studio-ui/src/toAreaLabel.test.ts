import { expect, test } from "vitest";
import { toAreaLabel } from "./toAreaLabel";

test("the top level of the page reads as Page body", () => {
  expect(toAreaLabel(undefined, "default-zone")).toBe("Page body");
});

test("a slot under a block names the block and the slot", () => {
  expect(toAreaLabel("SectionStack", "sections")).toBe("SectionStack sections");
});

test("a camelCase slot name reads as words, lowercased after the block", () => {
  expect(toAreaLabel("Hero", "sidebarItems")).toBe("Hero sidebar items");
});
