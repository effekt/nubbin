import { isValidElement } from "react";
import { expect, test } from "vitest";
import { withRenderedSlots } from "./withRenderedSlots";

const Slot = () => null;

test("a named slot's component becomes an element", () => {
  const rendered = withRenderedSlots({ sections: Slot, headline: "hi" }, ["sections"]);
  expect(isValidElement(rendered.sections)).toBe(true);
  expect(rendered.headline).toBe("hi");
});

test("puck's own props are dropped", () => {
  const rendered = withRenderedSlots({ puck: {}, editMode: true, id: "n1" }, []);
  expect("puck" in rendered).toBe(false);
  expect("editMode" in rendered).toBe(false);
  expect(rendered.id).toBe("n1");
});

test("a slot name whose value is not a component passes through untouched", () => {
  const rendered = withRenderedSlots({ sections: "not a slot" }, ["sections"]);
  expect(rendered.sections).toBe("not a slot");
});
