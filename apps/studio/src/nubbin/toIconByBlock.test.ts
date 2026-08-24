import { expect, test } from "vitest";
import { toIconByBlock } from "./toIconByBlock";

test("flattens every group's icons by block name, skipping blocks without one", () => {
  expect(
    toIconByBlock([
      { title: "Content", blocks: [{ name: "Hero", icon: "hero" }, { name: "Prose" }] },
      { title: "Layout", blocks: [{ name: "Stack", icon: "stack" }] },
    ]),
  ).toEqual({ Hero: "hero", Stack: "stack" });
});
