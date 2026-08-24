import { registry } from "demo/src/nubbin/registry";
import { expect, test } from "vitest";
import { firstAllowedBlock } from "./firstAllowedBlock";

test("a constrained slot fills with the first block its allow list names", () => {
  const cards = registry.get("CardGrid")?.slots.cards;
  expect(cards).toBeDefined();
  if (cards === undefined) {
    return;
  }
  expect(firstAllowedBlock(cards, registry)).toBe("Card");
});

test("an open slot fills with the first registered block", () => {
  expect(firstAllowedBlock({}, registry)).toBe(registry.names()[0]);
});

test("an allow list resolving nothing yields undefined rather than a guess", () => {
  expect(firstAllowedBlock({ allow: ["NoSuchBlock"] }, registry)).toBeUndefined();
});

test("unregistered entries are skipped, not tripped over", () => {
  expect(firstAllowedBlock({ allow: ["NoSuchBlock", "Card"] }, registry)).toBe("Card");
});
