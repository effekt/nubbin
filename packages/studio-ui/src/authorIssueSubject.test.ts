import { expect, test } from "vitest";
import { authorIssueSubject } from "./authorIssueSubject";

test("joins block and field label with an em dash", () => {
  expect(
    authorIssueSubject({ blockName: "Hero", fieldLabel: "Headline", message: "too long" }),
  ).toBe("Hero — Headline");
});

test("a missing label shortens the subject to the block", () => {
  expect(authorIssueSubject({ blockName: "Hero", message: "too long" })).toBe("Hero");
});

test("nothing to name yields undefined, never an empty string", () => {
  expect(authorIssueSubject({ message: "route already exists" })).toBeUndefined();
});
