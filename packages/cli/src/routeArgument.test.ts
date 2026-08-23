import { describe, expect, test } from "vitest";
import { routeArgument } from "./routeArgument";

describe("routeArgument", () => {
  test("reads the first positional as the route", () => {
    expect(routeArgument({ positionals: ["/pricing", "abc"] })).toBe("/pricing");
  });

  test("refuses when no route was given, naming what is missing", () => {
    expect(() => routeArgument({ positionals: [] })).toThrow(/needs a route/);
  });
});
