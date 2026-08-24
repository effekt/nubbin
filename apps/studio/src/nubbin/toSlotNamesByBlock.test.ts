import { registry } from "demo/src/nubbin/registry";
import { expect, test } from "vitest";
import { toSlotNamesByBlock } from "./toSlotNamesByBlock";

test("each block maps to its declared slot names", () => {
  const slotNames = toSlotNamesByBlock(registry);
  expect(slotNames.SectionStack).toEqual(["sections"]);
  expect(slotNames.Split).toEqual(["start", "end"]);
  expect(slotNames.CardGrid).toEqual(["cards"]);
});

test("a block with no slots maps to an empty list, not a missing key", () => {
  const slotNames = toSlotNamesByBlock(registry);
  expect(slotNames.Hero).toEqual([]);
});
