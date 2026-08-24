import { expect, test } from "vitest";
import { parseHistoryReply } from "./parseHistoryReply";

const move = { hash: "a1", documentVersion: 1, movedAt: "2026-08-24" };

test("the contract's shape passes through", () => {
  const body = JSON.stringify({ current: "a1", moves: [move], total: 1 });
  expect(parseHistoryReply(body)).toEqual({ current: "a1", moves: [move], total: 1 });
});

test("null current and null moves are values, not failures", () => {
  const body = JSON.stringify({ current: null, moves: null, total: 0 });
  expect(parseHistoryReply(body)).toEqual({ current: null, moves: null, total: 0 });
});

test("not JSON, or JSON of another shape, is undefined rather than invented rows", () => {
  expect(parseHistoryReply("<html></html>")).toBeUndefined();
  expect(parseHistoryReply(JSON.stringify({ current: 4, moves: [], total: 0 }))).toBeUndefined();
  expect(
    parseHistoryReply(JSON.stringify({ current: "a1", moves: [{}], total: 1 })),
  ).toBeUndefined();
  expect(parseHistoryReply(JSON.stringify({ current: "a1", moves: [] }))).toBeUndefined();
});
