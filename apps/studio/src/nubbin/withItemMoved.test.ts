import { expect, test } from "vitest";
import { withItemMoved } from "./withItemMoved";

test("moves one item and returns a new array", () => {
  const list = ["a", "b", "c"];
  expect(withItemMoved(list, 0, 2)).toEqual(["b", "c", "a"]);
  expect(withItemMoved(list, 2, 0)).toEqual(["c", "a", "b"]);
  expect(list).toEqual(["a", "b", "c"]);
});

test("an index off either end moves nothing", () => {
  expect(withItemMoved(["a", "b"], -1, 1)).toEqual(["a", "b"]);
  expect(withItemMoved(["a", "b"], 0, 2)).toEqual(["a", "b"]);
});
