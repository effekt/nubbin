import { describe, expect, test } from "vitest";
import { placementOf } from "./placementOf";

describe("placementOf", () => {
  test("reads the parent, the slot, and the index", () => {
    expect(
      placementOf({ args: { positionals: [], parent: "n1", slot: "body", index: 2 } }),
    ).toEqual({
      parent: "n1",
      slot: "body",
      index: 2,
    });
  });

  test("an absent index is an absent property, not undefined", () => {
    const placed = placementOf({ args: { positionals: [], parent: "n1", slot: "body" } });
    expect("index" in placed).toBe(false);
  });

  test("refuses a missing --parent by name", () => {
    expect(() => placementOf({ args: { positionals: [], slot: "body" } })).toThrow(/--parent/);
  });

  test("refuses a missing --slot by name", () => {
    expect(() => placementOf({ args: { positionals: [], parent: "n1" } })).toThrow(/--slot/);
  });
});
