import { describe, expect, test } from "vitest";
import { existingConfigOutcome } from "./existingConfigOutcome";

describe("existingConfigOutcome", () => {
  test("names the file, writes nothing, and refuses", () => {
    expect(existingConfigOutcome("nubbin.config.js")).toEqual({
      lines: ["wrote nothing: nubbin.config.js already exists"],
      code: 1,
    });
  });
});
