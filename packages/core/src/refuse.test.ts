import { describe, expect, test } from "vitest";
import { NubbinError } from "./NubbinError";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { refuse } from "./refuse";

describe("refuse", () => {
  test("throws a NubbinError carrying the code it was given", () => {
    try {
      refuse(NubbinIssueCode.NoSuchNode, "no node");
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(NubbinError);
      expect((error as NubbinError).code).toBe(NubbinIssueCode.NoSuchNode);
    }
  });

  test("carries the subject when given one", () => {
    try {
      refuse(NubbinIssueCode.DuplicateBlockName, "twice", "Hero");
      expect.unreachable();
    } catch (error) {
      expect((error as NubbinError).issues[0]?.at).toBe("Hero");
    }
  });

  // Without `at`, the key is absent rather than present and undefined — `exactOptionalPropertyTypes`
  // is on, and a serialized issue should not carry a field that says nothing.
  test("omits the subject entirely when there is none to name", () => {
    try {
      refuse(NubbinIssueCode.NotStandardSchema, "no validate");
      expect.unreachable();
    } catch (error) {
      expect(Object.keys((error as NubbinError).issues[0] ?? {})).toEqual(["code", "message"]);
    }
  });
});
