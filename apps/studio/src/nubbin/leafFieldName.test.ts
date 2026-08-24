import { expect, test } from "vitest";
import { leafFieldName } from "./leafFieldName";

test("takes the last segment of a dotted path", () => {
  expect(leafFieldName("cta.label")).toBe("label");
  expect(leafFieldName("items[].name")).toBe("name");
});

test("leaves a single segment as it is", () => {
  expect(leafFieldName("headline")).toBe("headline");
});

test("a row shape's own path drops the [] marker", () => {
  expect(leafFieldName("items[]")).toBe("items");
});
