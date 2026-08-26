import { expect, test } from "vitest";
import { openRepeaterRowFor } from "./openRepeaterRowFor";

function repeater(expanded: boolean): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = `
    <fieldset id="n7_custom_stats" class="nb-repeater">
      <ul class="nb-repeater-rows">
        <li class="nb-repeater-row"><div class="nb-repeater-rowhead">
          <button class="nb-repeater-disclose" aria-expanded="${expanded}">Uptime</button>
        </div></li>
      </ul>
    </fieldset>`;
  return root;
}

function foundStats(root: HTMLElement) {
  const element = root.querySelector<HTMLElement>("fieldset");
  if (element === null) throw new Error("fixture lost its fieldset");
  return { element, path: "stats" };
}

test("a closed row on the path is clicked open and its disclosure returned", () => {
  const root = repeater(false);
  let clicks = 0;
  root.querySelector("button")?.addEventListener("click", () => {
    clicks += 1;
  });
  const disclose = openRepeaterRowFor(foundStats(root), "stats.0.label");
  expect(disclose?.textContent).toBe("Uptime");
  expect(clicks).toBe(1);
});

test("an already open row is left alone", () => {
  const root = repeater(true);
  let clicks = 0;
  root.querySelector("button")?.addEventListener("click", () => {
    clicks += 1;
  });
  expect(openRepeaterRowFor(foundStats(root), "stats.0.label")).toBeDefined();
  expect(clicks).toBe(0);
});

test("a landing that is not a repeater, a non-row segment and a missing row all refuse", () => {
  const root = repeater(false);
  const found = foundStats(root);
  expect(openRepeaterRowFor(found, "stats")).toBeUndefined();
  expect(openRepeaterRowFor(found, "stats.label")).toBeUndefined();
  expect(openRepeaterRowFor(found, "stats.4.label")).toBeUndefined();
  const plain = document.createElement("input");
  expect(openRepeaterRowFor({ element: plain, path: "stats" }, "stats.0.label")).toBeUndefined();
});
