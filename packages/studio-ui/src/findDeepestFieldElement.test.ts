import { expect, test } from "vitest";
import { findDeepestFieldElement } from "./findDeepestFieldElement";

const prefixes = ["stats.0.label", "stats.0", "stats"];

function region(html: string): ParentNode {
  const root = document.createElement("div");
  root.innerHTML = html;
  return root;
}

test("the leaf's own control wins while it is in the DOM", () => {
  const root = region(
    '<fieldset id="n7_custom_stats"><input id="n7_custom_stats_0_label" /></fieldset>',
  );
  const found = findDeepestFieldElement(root, "n7", prefixes);
  expect(found?.path).toBe("stats.0.label");
  expect(found?.element.id).toBe("n7_custom_stats_0_label");
});

test("a collapsed row's leaf falls back to the container that is rendered", () => {
  const root = region('<fieldset id="n7_custom_stats"></fieldset>');
  const found = findDeepestFieldElement(root, "n7", prefixes);
  expect(found?.path).toBe("stats");
});

test("nothing addressed is honestly nothing", () => {
  expect(findDeepestFieldElement(region("<input id='other' />"), "n7", prefixes)).toBeUndefined();
});
