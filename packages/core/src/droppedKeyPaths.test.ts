import { describe, expect, test } from "vitest";
import { droppedKeyPaths } from "./droppedKeyPaths";

describe("droppedKeyPaths", () => {
  test("nothing was dropped when the parsed value carries every key", () => {
    expect(droppedKeyPaths({ a: 1 }, { a: 1 })).toEqual([]);
  });

  test("names a top-level key the schema did not keep", () => {
    expect(droppedKeyPaths({ title: "T", heading: "typo" }, { title: "T" })).toEqual(["heading"]);
  });

  // A typo inside a nested object is the same mistake as one at the top, and a check that only
  // read the first level would report the value as accepted.
  test("names a nested key by its dotted path", () => {
    expect(
      droppedKeyPaths({ cta: { label: "Go", hrefff: "/x" } }, { cta: { label: "Go" } }),
    ).toEqual(["cta.hrefff"]);
  });

  test("says nothing about a key the schema added — a default is not a loss", () => {
    expect(droppedKeyPaths({ title: "T" }, { title: "T", tone: "light" })).toEqual([]);
  });

  test("says nothing about a value the schema reshaped — a transform is not a loss", () => {
    expect(droppedKeyPaths({ count: "42", slug: "Mixed" }, { count: 42, slug: "mixed" })).toEqual(
      [],
    );
  });

  test("does not descend into an array, whose members no path addresses", () => {
    expect(droppedKeyPaths({ items: [{ a: 1 }] }, { items: [{}] })).toEqual([]);
  });

  test("names a whole nested object the schema dropped, not each key beneath it", () => {
    expect(droppedKeyPaths({ a: 1, extra: { deep: true } }, { a: 1 })).toEqual(["extra"]);
  });
});
