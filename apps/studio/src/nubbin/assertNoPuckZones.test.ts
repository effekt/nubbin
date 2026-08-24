import { expect, test } from "vitest";
import { assertNoPuckZones } from "./assertNoPuckZones";

test("absent zones pass", () => {
  expect(() => assertNoPuckZones({ content: [], root: {} })).not.toThrow();
});

test("empty zones are Puck's own default and pass", () => {
  expect(() => assertNoPuckZones({ content: [], root: {}, zones: {} })).not.toThrow();
});

test("populated zones are refused by name rather than dropped", () => {
  const data = {
    content: [],
    root: {},
    zones: { "stack:sections": [{ type: "Hero", props: { id: "h1" } }] },
  };
  expect(() => assertNoPuckZones(data)).toThrow(/stack:sections/);
});
