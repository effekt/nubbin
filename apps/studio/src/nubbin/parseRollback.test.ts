import { expect, test } from "vitest";
import { parseRollback } from "./parseRollback";

test("a route and a hash pass through", () => {
  expect(parseRollback({ route: "/", hash: "abc123" })).toEqual({ route: "/", hash: "abc123" });
});

test("a missing or empty member is malformed", () => {
  expect(parseRollback({ route: "/" })).toBeUndefined();
  expect(parseRollback({ hash: "abc123" })).toBeUndefined();
  expect(parseRollback({ route: "", hash: "abc123" })).toBeUndefined();
  expect(parseRollback({ route: "/", hash: "" })).toBeUndefined();
});

test("a non-object body is malformed, not a throw", () => {
  expect(parseRollback(undefined)).toBeUndefined();
  expect(parseRollback("route=/")).toBeUndefined();
  expect(parseRollback(null)).toBeUndefined();
});
