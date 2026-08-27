import { describe, expect, it } from "vitest";
import { parseOption } from "./parseOption";

const OPTIONS = ["self", "nubbin"];

describe("parseOption", () => {
  it("reads a position as the option at it", () => {
    expect(parseOption("a", OPTIONS)).toBe("self");
    expect(parseOption("b", OPTIONS)).toBe("nubbin");
  });

  it("returns null for a position past the options", () => {
    expect(parseOption("c", OPTIONS)).toBeNull();
    expect(parseOption("z", OPTIONS)).toBeNull();
  });

  it("returns null for a character that is not a position", () => {
    expect(parseOption("1", OPTIONS)).toBeNull();
    expect(parseOption("", OPTIONS)).toBeNull();
    expect(parseOption("ab", OPTIONS)).toBeNull();
  });
});
