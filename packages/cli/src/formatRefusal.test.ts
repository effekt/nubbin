import { NubbinError, NubbinIssueCode } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { formatRefusal } from "./formatRefusal";
import { UsageError } from "./UsageError";

describe("formatRefusal", () => {
  test("prints one line per cause, so six problems read as six", () => {
    const error = new NubbinError([
      { code: NubbinIssueCode.UnknownBlock, message: "no block Ghost", at: "n1" },
      {
        code: NubbinIssueCode.SlotMax,
        message: "items holds 3, max 2",
        at: "n2",
        path: "slots.items",
      },
    ]);
    expect(formatRefusal(error)).toEqual([
      "unknown-block at n1: no block Ghost",
      "slot-max at n2 slots.items: items holds 3, max 2",
    ]);
  });

  test("an error that is not Nubbin's is printed as its message, not swallowed", () => {
    expect(formatRefusal(new Error("EACCES: permission denied"))).toEqual([
      "EACCES: permission denied",
    ]);
  });

  test("a usage error's detail lines follow its message, one line each", () => {
    const error = new UsageError("plan.json is not a plan:", ["  drafts: Expected one of: self."]);
    expect(formatRefusal(error)).toEqual([
      "plan.json is not a plan:",
      "  drafts: Expected one of: self.",
    ]);
  });

  test("a usage error with no details is its message alone", () => {
    expect(formatRefusal(new UsageError("no config at x"))).toEqual(["no config at x"]);
  });
});
