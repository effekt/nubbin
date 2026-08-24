import { expect, test } from "vitest";
import { focusFieldElement } from "./focusFieldElement";

test("an input takes focus directly and stays out of no tab order", () => {
  const input = document.createElement("input");
  document.body.appendChild(input);
  focusFieldElement(input);
  expect(document.activeElement).toBe(input);
  expect(input.hasAttribute("tabindex")).toBe(false);
  input.remove();
});

test("a fieldset is made focusable without joining the tab order", () => {
  const fieldset = document.createElement("fieldset");
  document.body.appendChild(fieldset);
  focusFieldElement(fieldset);
  expect(fieldset.tabIndex).toBe(-1);
  expect(document.activeElement).toBe(fieldset);
  fieldset.remove();
});
