import { describe, expect, test } from "vitest";
import { NubbinIssueCode } from "./NubbinIssueCode";

describe("NubbinIssueCode", () => {
  test("every member's value is its own kebab-case name, so a log reads as the code", () => {
    for (const [name, value] of Object.entries(NubbinIssueCode)) {
      expect(value, `${name} should be kebab-case`).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });

  test("no two members share a value — a consumer keying off one must reach one cause", () => {
    const values = Object.values(NubbinIssueCode);
    expect(new Set(values).size).toBe(values.length);
  });

  // The point of exporting it: a consumer writes `NubbinIssueCode.UnknownProp`, not the string,
  // and a typo is a compile error rather than a branch that never runs.
  test("is keyable by name", () => {
    expect(NubbinIssueCode.UnknownProp).toBe("unknown-prop");
    expect(NubbinIssueCode.InvalidProps).toBe("invalid-props");
  });
});
