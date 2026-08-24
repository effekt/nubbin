import { home } from "demo/fixtures/home";
import { expect, test } from "vitest";
import { isDocumentVersionShape } from "./isDocumentVersionShape";

test("accepts a real fixture document", () => {
  expect(isDocumentVersionShape(home)).toBe(true);
});

test("accepts a version whose values the compiler would refuse — shape is not validity", () => {
  const invalid = { ...home, elements: { ...home.elements, hero: { id: "hero" } } };
  expect(isDocumentVersionShape(invalid)).toBe(true);
});

test.each([null, "text", 7, []])("rejects the non-document %j", (value) => {
  expect(isDocumentVersionShape(value)).toBe(false);
});

test.each([
  "documentId",
  "version",
  "roots",
  "elements",
  "meta",
  "createdAt",
  "createdBy",
] as const)("rejects a document missing %s", (field) => {
  const { [field]: _dropped, ...rest } = home;
  expect(isDocumentVersionShape(rest)).toBe(false);
});

test.each([
  { field: "documentId", value: 7 },
  { field: "version", value: "1" },
  { field: "roots", value: {} },
  { field: "elements", value: null },
  { field: "meta", value: "home" },
  { field: "createdAt", value: 0 },
  { field: "createdBy", value: [] },
])("rejects a document whose $field is $value", ({ field, value }) => {
  expect(isDocumentVersionShape({ ...home, [field]: value })).toBe(false);
});
