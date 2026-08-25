import { createRegistry, defineBlock } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toDerivedCategory } from "./toDerivedCategory";

const schema = z.object({});

const registry = createRegistry([
  defineBlock({ name: "Prose", schema, component: null, version: 1, slots: {} }),
  defineBlock({ name: "Stack", schema, component: null, version: 1, slots: { sections: {} } }),
]);

test("a block with a slot derives Layout", () => {
  expect(toDerivedCategory(registry, "Stack")).toBe("Layout");
});

test("a block without slots derives Content", () => {
  expect(toDerivedCategory(registry, "Prose")).toBe("Content");
});

test("a name the registry lacks derives Content rather than throwing", () => {
  expect(toDerivedCategory(registry, "Missing")).toBe("Content");
});
