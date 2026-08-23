import { describe, expect, test } from "vitest";
import { setAtPath } from "./setAtPath";

describe("setAtPath", () => {
  test("replaces a top-level key without mutating the input", () => {
    const input = { title: "T", price: 0 };
    const output = setAtPath(input, "price", 42);
    expect(output).toEqual({ title: "T", price: 42 });
    expect(input.price).toBe(0);
  });

  test("descends a dotted path, creating intermediate objects", () => {
    expect(setAtPath({}, "cta.price", 42)).toEqual({ cta: { price: 42 } });
  });

  test("rejects an array-member path, which no hole can address", () => {
    expect(() => setAtPath({}, "items[].price", 42)).toThrow(/items\[\]/);
  });

  // `typeof [] === "object"`, so descending into an array used to spread it into a record: an
  // `items` of `["a", "b"]` came back as `{ 0: "X", 1: "b" }`, an object wearing the array's
  // shape. Nothing on the write path noticed, and the value failed its schema at the next
  // compile, naming the field rather than the edit that ruined it. `takeAtPath` already refuses
  // an array here; this is the half of that rule the inverse was missing.
  test("refuses to descend into an array rather than spreading it into an object", () => {
    expect(() => setAtPath({ items: ["a", "b"] }, "items.0", "X")).toThrow(/items/);
  });

  test("still replaces an array wholesale, which is what a hole on the field does", () => {
    expect(setAtPath({ items: ["a", "b"] }, "items", ["c"])).toEqual({ items: ["c"] });
  });

  test("creates an intermediate object where a non-object sits, as it always has", () => {
    expect(setAtPath({ cta: "not an object" }, "cta.price", 42)).toEqual({ cta: { price: 42 } });
  });
});
