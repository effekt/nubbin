import { registry } from "demo/src/nubbin/registry";
import { expect, test } from "vitest";
import { toPuckCategories } from "./toPuckCategories";

test("a block that declares a slot files under Layout, the rest under Content", () => {
  const names = ["Hero", "SectionStack", "Prose", "Split"];
  const categories = toPuckCategories(registry, names);
  expect(categories.layout?.components).toEqual(["SectionStack", "Split"]);
  expect(categories.content?.components).toEqual(["Hero", "Prose"]);
});

test("every name lands in exactly one group", () => {
  const names = ["Hero", "SectionStack"];
  const categories = toPuckCategories(registry, names);
  const placed = [
    ...(categories.content?.components ?? []),
    ...(categories.layout?.components ?? []),
  ];
  expect(placed.sort()).toEqual([...names].sort());
});
