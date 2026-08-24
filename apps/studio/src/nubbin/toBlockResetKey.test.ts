import { expect, test } from "vitest";
import { toBlockResetKey } from "./toBlockResetKey";

test("the same values give the same key, and a changed value changes it", () => {
  const key = toBlockResetKey({ heading: "Tides", tone: "light" });
  expect(toBlockResetKey({ heading: "Tides", tone: "light" })).toBe(key);
  expect(toBlockResetKey({ heading: "Tides corrected", tone: "light" })).not.toBe(key);
});

test("functions carry no value, so a new function identity does not move the key", () => {
  const key = toBlockResetKey({ heading: "Tides", sections: () => null });
  expect(toBlockResetKey({ heading: "Tides", sections: () => null })).toBe(key);
});

test("a value the serializer cannot walk yields the constant key rather than a throw", () => {
  const cyclic: Record<string, unknown> = {};
  cyclic.self = cyclic;
  expect(toBlockResetKey(cyclic)).toBe("");
});
