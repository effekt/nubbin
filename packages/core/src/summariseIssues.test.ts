import { describe, expect, test } from "vitest";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { summariseIssues } from "./summariseIssues";

describe("summariseIssues", () => {
  test("one issue with a subject reads as subject, code, message", () => {
    expect(
      summariseIssues([
        { code: NubbinIssueCode.SlotMin, message: "too few", at: "n1 slots.items" },
      ]),
    ).toBe("n1 slots.items [slot-min]: too few");
  });

  test("one issue with no subject reads as its own message", () => {
    expect(
      summariseIssues([{ code: NubbinIssueCode.NoRoots, message: "a document needs a root" }]),
    ).toBe("a document needs a root [no-roots]");
  });

  test("several are counted and listed, one per line", () => {
    const text = summariseIssues([
      { code: NubbinIssueCode.Cycle, message: "cycle", at: "n1" },
      { code: NubbinIssueCode.Unreachable, message: "unreachable", at: "n2" },
    ]);
    expect(text.split("\n")).toEqual([
      "Refused with 2 issue(s):",
      "n1 [cycle]: cycle",
      "n2 [unreachable]: unreachable",
    ]);
  });
});
