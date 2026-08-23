import { NubbinError, NubbinIssueCode } from "@nubbin/core";
import { describe, expect, test } from "vitest";
import { formatRefusal } from "./formatRefusal";

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
});
