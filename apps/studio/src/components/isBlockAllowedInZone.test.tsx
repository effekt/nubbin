import type { ComponentData, Config } from "@measured/puck";
import { expect, test } from "vitest";
import { isBlockAllowedInZone } from "./isBlockAllowedInZone";

const config: Config = {
  components: {
    Faq: { fields: { help: { type: "slot", allow: ["CtaCard"] } }, render: () => <div /> },
    Stack: { fields: { children: { type: "slot" } }, render: () => <div /> },
  },
};

const items: Record<string, ComponentData> = {
  "faq-1": { type: "Faq", props: { id: "faq-1" } },
  "stack-1": { type: "Stack", props: { id: "stack-1" } },
};

const getItemById = (id: string) => items[id];

test("the root zone accepts anything, as Puck's own drags do", () => {
  expect(isBlockAllowedInZone(config, getItemById, "root:default-zone", "Hero")).toBe(true);
});

test("a slot's allow list admits its blocks and refuses the rest", () => {
  expect(isBlockAllowedInZone(config, getItemById, "faq-1:help", "CtaCard")).toBe(true);
  expect(isBlockAllowedInZone(config, getItemById, "faq-1:help", "Hero")).toBe(false);
});

test("an unconstrained slot accepts anything", () => {
  expect(isBlockAllowedInZone(config, getItemById, "stack-1:children", "Hero")).toBe(true);
});

test("a zone whose parent the data no longer holds refuses", () => {
  expect(isBlockAllowedInZone(config, getItemById, "gone-1:help", "CtaCard")).toBe(false);
});
