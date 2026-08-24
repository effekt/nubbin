import { describe, expect, test } from "vitest";
import { nodeIdArgument } from "./nodeIdArgument";

describe("nodeIdArgument", () => {
  test("reads the id after the route", () => {
    expect(nodeIdArgument({ positionals: ["/pricing", "n1"] })).toBe("n1");
  });

  test("refuses its absence, naming what is missing", () => {
    expect(() => nodeIdArgument({ positionals: ["/pricing"] })).toThrow(/needs a node id/);
  });
});
