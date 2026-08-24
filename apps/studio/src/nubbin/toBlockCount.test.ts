import { expect, test } from "vitest";
import { toBlockCount } from "./toBlockCount";

test("sums the blocks across every group", () => {
  expect(
    toBlockCount([
      { title: "Content", blocks: [{ name: "Hero" }, { name: "Prose" }] },
      { title: "Layout", blocks: [{ name: "Stack" }] },
    ]),
  ).toBe(3);
});

test("an empty palette counts zero", () => {
  expect(toBlockCount([])).toBe(0);
});
