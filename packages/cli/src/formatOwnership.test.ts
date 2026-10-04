import { describe, expect, test } from "vitest";
import { formatOwnership } from "./formatOwnership";

describe("formatOwnership", () => {
  test("two lines, each party followed by what it runs", () => {
    expect(formatOwnership({ you: ["Application", "Components"], nubbin: ["Studio"] })).toEqual([
      "You run: Application, Components",
      "Nubbin runs: Studio",
    ]);
  });

  test("a party running nothing says so rather than trailing off", () => {
    expect(formatOwnership({ you: ["Application"], nubbin: [] })).toEqual([
      "You run: Application",
      "Nubbin runs: nothing",
    ]);
  });
});
