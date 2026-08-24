import { describe, expect, test } from "vitest";
import { listingOf } from "./listingOf";

describe("listingOf", () => {
  test("passes the lines through when there are some", () => {
    expect(listingOf(["a", "b"], "nothing").lines).toEqual(["a", "b"]);
  });

  test("says so rather than printing nothing when there are none", () => {
    expect(listingOf([], "nothing is live").lines).toEqual(["nothing is live"]);
  });

  test("an empty answer still succeeds", () => {
    expect(listingOf([], "nothing").code).toBe(0);
  });
});
