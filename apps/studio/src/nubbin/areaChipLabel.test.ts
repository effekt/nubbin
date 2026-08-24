import { expect, test } from "vitest";
import { areaChipLabel } from "./areaChipLabel";

test("a bounded slot reads n of max", () => {
  expect(areaChipLabel(4, 12)).toBe("4 of 12");
});

test("an unbounded slot reads the count alone", () => {
  expect(areaChipLabel(3, undefined)).toBe("3");
});
