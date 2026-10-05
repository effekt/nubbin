import { describe, expect, test } from "vitest";
import { isPlanCode } from "./isPlanCode";

describe("isPlanCode", () => {
  test.each(["v1-aaaaaaaa000aaa", "v2-anything", "v1-"])("%s reads as a code", (argument) => {
    expect(isPlanCode(argument)).toBe(true);
  });

  test.each(["plan.json", "./v1-plan.json", "v1", "V1-aaaaaaaa000aaa", "plans/v1-x"])(
    "%s reads as a path",
    (argument) => {
      expect(isPlanCode(argument)).toBe(false);
    },
  );
});
