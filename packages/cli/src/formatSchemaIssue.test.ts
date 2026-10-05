import { describe, expect, test } from "vitest";
import { formatSchemaIssue } from "./formatSchemaIssue";

describe("formatSchemaIssue", () => {
  test("an issue at a field is indented beneath the heading line and led by the field", () => {
    expect(formatSchemaIssue({ message: "Expected one of: self, nubbin.", path: ["drafts"] })).toBe(
      "  drafts: Expected one of: self, nubbin.",
    );
  });

  test("an issue with no path is the message alone, indented the same", () => {
    expect(formatSchemaIssue({ message: "Expected an object carrying every plan field." })).toBe(
      "  Expected an object carrying every plan field.",
    );
  });

  test("an empty path reads as no path", () => {
    expect(formatSchemaIssue({ message: "m", path: [] })).toBe("  m");
  });

  test("a nested path joins its segments, keyed or bare", () => {
    expect(formatSchemaIssue({ message: "m", path: [{ key: "notifications" }, 0] })).toBe(
      "  notifications.0: m",
    );
  });
});
