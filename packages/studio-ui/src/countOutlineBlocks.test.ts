import { expect, test } from "vitest";
import { countOutlineBlocks } from "./countOutlineBlocks";

test("counts blocks at every depth and never the areas between them", () => {
  expect(
    countOutlineBlocks([
      {
        id: "a",
        type: "Stack",
        areas: [
          {
            name: "children",
            max: undefined,
            children: [
              { id: "b", type: "Hero", areas: [] },
              { id: "c", type: "Faq", areas: [{ name: "help", max: 1, children: [] }] },
            ],
          },
        ],
      },
    ]),
  ).toBe(3);
});

test("an empty outline counts zero", () => {
  expect(countOutlineBlocks([])).toBe(0);
});
