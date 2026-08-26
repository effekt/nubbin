import { describe, expect, test } from "vitest";
import { toOpenHref } from "./toOpenHref";

describe("toOpenHref", () => {
  test("passes an absolute URL through untouched, origin or no origin", () => {
    expect(toOpenHref("https://example.com/x", "http://localhost:3100")).toBe(
      "https://example.com/x",
    );
    expect(toOpenHref("https://example.com/x", undefined)).toBe("https://example.com/x");
  });

  test("resolves a root-relative path against the consumer origin", () => {
    expect(toOpenHref("/dispatches/tide-tables", "http://localhost:3100")).toBe(
      "http://localhost:3100/dispatches/tide-tables",
    );
  });

  test("opens nowhere for a relative path with no origin to resolve against", () => {
    expect(toOpenHref("/dispatches", undefined)).toBeUndefined();
  });

  test("opens nowhere for a value that is not a link", () => {
    expect(toOpenHref("not a link", "http://localhost:3100")).toBeUndefined();
  });
});
