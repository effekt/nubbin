import { describe, expect, test } from "vitest";
import { NubbinError } from "./NubbinError";
import { NubbinIssueCode } from "./NubbinIssueCode";

describe("NubbinError", () => {
  test("is an Error, so an existing catch still holds it", () => {
    const error = new NubbinError([{ code: NubbinIssueCode.NoSuchNode, message: "no node" }]);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("NubbinError");
  });

  test("carries the issues as data, which is what a log or a tracker serializes", () => {
    const issues = [{ code: NubbinIssueCode.SlotMin, message: "too few", at: "n1 slots.items" }];
    expect(new NubbinError(issues).issues).toEqual(issues);
  });

  test("a single issue reads as its own message, with no framing to strip", () => {
    const error = new NubbinError([
      { code: NubbinIssueCode.DuplicateBlockName, message: 'Duplicate block name "Hero"' },
    ]);
    expect(error.message).toBe('Duplicate block name "Hero" [duplicate-block-name]');
  });

  // Compile collects rather than stopping at the first, so an author fixing six problems sees
  // six. The message has to carry all of them or the collection is thrown away at the boundary.
  test("many issues are summarised, one per line, each naming what it is about", () => {
    const error = new NubbinError([
      { code: NubbinIssueCode.InvalidProps, message: "expected string", at: "n1 title" },
      { code: NubbinIssueCode.Cycle, message: "cycle through n2", at: "n2" },
    ]);
    expect(error.message).toContain("2 issue(s)");
    expect(error.message).toContain("n1 title [invalid-props]: expected string");
    expect(error.message).toContain("n2 [cycle]: cycle through n2");
  });

  // The shape a consumer branches on: `error.code === NubbinIssueCode.UnknownProp`, with no
  // string to typo and no array to index through for the overwhelmingly common single-cause case.
  test("carries the code directly, for the one-cause case every throw site but compile is", () => {
    const error = new NubbinError([
      { code: NubbinIssueCode.UnknownProp, message: "not a field of Hero", at: "n1 heading" },
    ]);
    expect(error.code).toBe(NubbinIssueCode.UnknownProp);
  });

  test("a collected refusal reports its first cause as the code, and all of them as issues", () => {
    const error = new NubbinError([
      { code: NubbinIssueCode.Cycle, message: "cycle through n2", at: "n2" },
      { code: NubbinIssueCode.InvalidProps, message: "expected string", at: "n1 title" },
    ]);
    expect(error.code).toBe(NubbinIssueCode.Cycle);
    expect(error.issues).toHaveLength(2);
  });

  test("refuses to be constructed with no issues — an error with no cause names nothing", () => {
    expect(() => new NubbinError([])).toThrow();
  });
});
