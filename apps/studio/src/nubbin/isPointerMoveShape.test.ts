import { expect, test } from "vitest";
import { isPointerMoveShape } from "./isPointerMoveShape";

test("a move carries a hash, a document version and a timestamp", () => {
  expect(isPointerMoveShape({ hash: "a1", documentVersion: 2, movedAt: "2026-08-24" })).toBe(true);
});

test("a missing or mistyped member fails the judgment", () => {
  expect(isPointerMoveShape({ hash: "a1", documentVersion: 2 })).toBe(false);
  expect(isPointerMoveShape({ hash: "a1", documentVersion: "2", movedAt: "x" })).toBe(false);
  expect(isPointerMoveShape(null)).toBe(false);
  expect(isPointerMoveShape("a1")).toBe(false);
});
