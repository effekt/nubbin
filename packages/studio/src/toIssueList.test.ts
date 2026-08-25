import { NubbinError } from "@nubbin/core";
import { expect, test } from "vitest";
import { toIssueList } from "./toIssueList";

test("a NubbinError yields its own issues", () => {
  const error = new NubbinError([{ code: "invalid-props", message: "expected a string" }]);
  expect(toIssueList(error)).toEqual(error.issues);
});

test("a refusal reply yields its issues array", () => {
  const issues = [{ message: "one" }, { message: "two" }];
  expect(toIssueList({ ok: false, issues })).toEqual(issues);
});

test("a bare array is already the list", () => {
  expect(toIssueList([{ message: "one" }])).toEqual([{ message: "one" }]);
});

test("anything else becomes a single-entry list to judge", () => {
  expect(toIssueList("the server fell over")).toEqual(["the server fell over"]);
});
