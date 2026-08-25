import { expect, test } from "vitest";
import { home } from "../../../examples/demo/fixtures/home";
import { isDocumentVersionShape } from "./isDocumentVersionShape";
import { parseDraftSaveRequest } from "./parseDraftSaveRequest";
import { parseRollbackRequest } from "./parseRollbackRequest";
import { parseRouteCreateRequest } from "./parseRouteCreateRequest";

test("accepts document-shaped draft saves without judging node validity", () => {
  expect(parseDraftSaveRequest({ route: "/", version: home })).toEqual({
    route: "/",
    version: home,
  });
  expect(isDocumentVersionShape({ ...home, elements: { hero: { id: "hero" } } })).toBe(true);
});

test.each([null, "text", 7, []])("refuses the non-document %j", (value) => {
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
] as const)("refuses a document missing %s", (field) => {
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
])("refuses a document whose $field is $value", ({ field, value }) => {
  expect(isDocumentVersionShape({ ...home, [field]: value })).toBe(false);
});

test.each([null, "text", 7, [], { route: "/" }, { version: home }, { route: 1, version: home }])(
  "refuses the malformed save envelope %j",
  (body) => {
    expect(parseDraftSaveRequest(body)).toBeUndefined();
  },
);

test("refuses a save whose version is not document-shaped", () => {
  expect(parseDraftSaveRequest({ route: "/", version: { documentId: "home" } })).toBeUndefined();
});

test("parses route creation without duplicating core's route judgment", () => {
  expect(parseRouteCreateRequest({ route: "/spring-sale" })).toEqual({ route: "/spring-sale" });
});

test.each([undefined, null, "/x", {}, { route: 3 }])(
  "refuses the malformed route body %j",
  (body) => {
    expect(parseRouteCreateRequest(body)).toBeUndefined();
  },
);

test("requires both non-empty rollback members", () => {
  expect(parseRollbackRequest({ route: "/", hash: "abc123" })).toEqual({
    route: "/",
    hash: "abc123",
  });
  expect(parseRollbackRequest({ route: "/" })).toBeUndefined();
  expect(parseRollbackRequest({ hash: "abc123" })).toBeUndefined();
  expect(parseRollbackRequest({ route: "", hash: "abc123" })).toBeUndefined();
  expect(parseRollbackRequest({ route: "/", hash: "" })).toBeUndefined();
  expect(parseRollbackRequest(undefined)).toBeUndefined();
  expect(parseRollbackRequest("route=/")).toBeUndefined();
  expect(parseRollbackRequest(null)).toBeUndefined();
});
