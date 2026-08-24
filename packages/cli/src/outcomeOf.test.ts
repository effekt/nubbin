import type { NubbinIssue } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { outcomeOf } from "./outcomeOf";

const issue: NubbinIssue = {
  code: "unknown-prop",
  message: "subtitle is not in the schema",
  at: "n1",
  path: "subtitle",
};

describe("outcomeOf", () => {
  test("the headline is the whole answer, with nothing riding along inside it", () => {
    const outcome = outcomeOf("/pricing -> 9f2c1a8e4b7d0356", []);
    expect(outcome.lines).toEqual(["/pricing -> 9f2c1a8e4b7d0356"]);
    expect(outcome.warnings).toEqual([]);
    expect(outcome.code).toBe(0);
  });

  test("issues become warnings beside the answer, and do not change the exit code", () => {
    const outcome = outcomeOf("/pricing -> 9f2c1a8e4b7d0356", [issue]);
    expect(outcome.lines).toEqual(["/pricing -> 9f2c1a8e4b7d0356"]);
    expect(outcome.warnings?.join("\n")).toContain("unknown-prop");
    expect(outcome.code).toBe(0);
  });
});
