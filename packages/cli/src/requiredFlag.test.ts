import { describe, expect, test } from "vitest";
import { requiredFlag } from "./requiredFlag";
import { UsageError } from "./UsageError";

describe("requiredFlag", () => {
  test("passes a present value through", () => {
    expect(requiredFlag("n1", "parent")).toBe("n1");
  });

  test("refuses an absent one, naming the flag with its dashes", () => {
    expect(() => requiredFlag(undefined, "parent")).toThrow(UsageError);
    expect(() => requiredFlag(undefined, "parent")).toThrow(/--parent/);
  });
});
