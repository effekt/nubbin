import { describe, expect, test } from "vitest";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { toIssue } from "./toIssue";

describe("toIssue", () => {
  test("carries the code and message it was given", () => {
    expect(toIssue(NubbinIssueCode.Cycle, "a cycle")).toEqual({
      code: NubbinIssueCode.Cycle,
      message: "a cycle",
    });
  });

  test("carries both coordinates when both are named", () => {
    expect(toIssue(NubbinIssueCode.InvalidProps, "bad", "n1", "title")).toEqual({
      code: NubbinIssueCode.InvalidProps,
      message: "bad",
      at: "n1",
      path: "title",
    });
  });

  test("omits a coordinate rather than setting it undefined", () => {
    expect(Object.keys(toIssue(NubbinIssueCode.NoRoots, "none"))).toEqual(["code", "message"]);
    expect(Object.keys(toIssue(NubbinIssueCode.Cycle, "c", "n1"))).toEqual([
      "code",
      "message",
      "at",
    ]);
  });
});
