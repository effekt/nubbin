import { expect, test } from "vitest";
import { parseZoneCompound } from "./parseZoneCompound";

test("the root zone reads as root and its default zone", () => {
  expect(parseZoneCompound("root:default-zone")).toEqual({
    parentId: "root",
    slot: "default-zone",
  });
});

test("a slot zone reads as the parent node and the slot name", () => {
  expect(parseZoneCompound("SectionStack-abc123:sections")).toEqual({
    parentId: "SectionStack-abc123",
    slot: "sections",
  });
});

test("only the first colon splits, and a compound without one keeps the whole id", () => {
  expect(parseZoneCompound("node-1:slot:extra")).toEqual({
    parentId: "node-1",
    slot: "slot:extra",
  });
  expect(parseZoneCompound("bare")).toEqual({ parentId: "bare", slot: "" });
});
