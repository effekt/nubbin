import { expect, test } from "vitest";
import { humanizeFieldPath } from "./humanizeFieldPath";

test("a single segment is capitalised", () => {
  expect(humanizeFieldPath("headline")).toBe("Headline");
});

test("dots become spaces and only the first word keeps its capital", () => {
  expect(humanizeFieldPath("cta.label")).toBe("Cta label");
});

test("camelCase splits into words", () => {
  expect(humanizeFieldPath("backgroundTone")).toBe("Background tone");
});

test("an array member path keeps its index as a word", () => {
  expect(humanizeFieldPath("items.0.title")).toBe("Items 0 title");
});

test("a path with nothing readable comes back unchanged", () => {
  expect(humanizeFieldPath("...")).toBe("...");
});
