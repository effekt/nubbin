import { describe, expect, test } from "vitest";
import { formatPlanIssue } from "./formatPlanIssue";

describe("formatPlanIssue", () => {
  test("the field a person would change, then the reason", () => {
    expect(
      formatPlanIssue({
        field: "artifacts",
        message: "Nubbin can only serve artifacts it stores.",
      }),
    ).toBe("artifacts: Nubbin can only serve artifacts it stores.");
  });
});
