import { describe, expect, test } from "vitest";
import { fnv1a } from "./fnv1a";

describe("fnv1a", () => {
  // The published FNV-1a/64 vectors. They are here so the function is checkable against the
  // specification rather than against itself: a hash that is only self-consistent passes a
  // round-trip test while being some other algorithm, and an artifact it addressed would then be
  // unreadable by any other implementation of the store contract.
  test.each([
    ["", "cbf29ce484222325"],
    ["a", "af63dc4c8601ec8c"],
    ["foobar", "85944171f73967e8"],
  ])("matches the published 64-bit vector for %o", (input, expected) => {
    expect(fnv1a(input)).toBe(expected);
  });

  test("is sixteen hex characters wide, zero-padded", () => {
    for (const input of ["", "a", "foobar", "nubbin", JSON.stringify({ deep: [1, 2, 3] })]) {
      expect(fnv1a(input)).toMatch(/^[0-9a-f]{16}$/);
    }
  });

  test("the same input always addresses the same value", () => {
    expect(fnv1a("the same input")).toBe(fnv1a("the same input"));
  });

  test("a one-character difference changes the address", () => {
    expect(fnv1a("promotions/summer")).not.toBe(fnv1a("promotions/summes"));
  });

  test("a value above the ASCII range is hashed by its code unit, not dropped", () => {
    expect(fnv1a("café")).not.toBe(fnv1a("caf"));
  });
});
