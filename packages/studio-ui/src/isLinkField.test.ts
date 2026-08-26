import { describe, expect, test } from "vitest";
import { isLinkField } from "./isLinkField";

describe("isLinkField", () => {
  test("holds for a string the catalog hinted as a link", () => {
    expect(
      isLinkField({ path: "cta.href", kind: "string", optional: false, control: "link" }),
    ).toBe(true);
  });

  test("does not hold without the hint, or for another control name", () => {
    expect(isLinkField({ path: "cta.href", kind: "string", optional: false })).toBe(false);
    expect(
      isLinkField({ path: "body", kind: "string", optional: false, control: "richText" }),
    ).toBe(false);
  });

  test("does not hold for a hinted non-string, which the control cannot edit", () => {
    expect(isLinkField({ path: "count", kind: "number", optional: false, control: "link" })).toBe(
      false,
    );
  });
});
