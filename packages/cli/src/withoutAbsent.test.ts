import { describe, expect, test } from "vitest";
import { withoutAbsent } from "./withoutAbsent";

describe("withoutAbsent", () => {
  test("drops keys holding undefined, so an absent flag is an absent property", () => {
    expect(withoutAbsent({ a: 1, b: undefined, c: "x" })).toEqual({ a: 1, c: "x" });
  });

  test("keeps every falsy value that is not undefined", () => {
    expect(withoutAbsent({ zero: 0, empty: "", no: false })).toEqual({
      zero: 0,
      empty: "",
      no: false,
    });
  });

  test("an empty record stays empty", () => {
    expect(withoutAbsent({})).toEqual({});
  });
});
