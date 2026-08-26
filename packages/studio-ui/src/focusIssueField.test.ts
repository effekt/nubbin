import { expect, test } from "vitest";
import { focusIssueField } from "./focusIssueField";

function mount(html: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.appendChild(root);
  return root;
}

test("a top-level path lands focus on the input that renders it", async () => {
  const root = mount('<input id="n7_custom_headline" />');
  expect(await focusIssueField(root, "n7", "headline", 2)).toBe("headline");
  expect(document.activeElement?.id).toBe("n7_custom_headline");
  root.remove();
});

test("a field rendering a few frames after selection is still landed on", async () => {
  const root = mount("");
  requestAnimationFrame(() => {
    root.innerHTML = '<input id="n7_custom_headline" />';
  });
  expect(await focusIssueField(root, "n7", "headline", 10)).toBe("headline");
  root.remove();
});

test("a leaf behind a closed repeater row is reached by opening the row", async () => {
  const root = mount(`
    <fieldset id="n7_custom_stats" class="nb-repeater">
      <ul class="nb-repeater-rows">
        <li class="nb-repeater-row"><div class="nb-repeater-rowhead">
          <button class="nb-repeater-disclose" aria-expanded="false">Uptime</button>
        </div></li>
      </ul>
    </fieldset>`);
  const row = root.querySelector(".nb-repeater-row");
  root.querySelector("button")?.addEventListener("click", () => {
    row?.insertAdjacentHTML("beforeend", '<input id="n7_custom_stats_0_label" />');
  });
  expect(await focusIssueField(root, "n7", "stats.0.label", 5)).toBe("stats.0.label");
  expect(document.activeElement?.id).toBe("n7_custom_stats_0_label");
  root.remove();
});

test("a row that renders nothing deeper leaves focus on its disclosure", async () => {
  const root = mount(`
    <fieldset id="n7_custom_stats" class="nb-repeater">
      <ul class="nb-repeater-rows">
        <li class="nb-repeater-row"><div class="nb-repeater-rowhead">
          <button class="nb-repeater-disclose" aria-expanded="false">Uptime</button>
        </div></li>
      </ul>
    </fieldset>`);
  expect(await focusIssueField(root, "n7", "stats.0.label", 2)).toBe("stats");
  expect(document.activeElement?.className).toBe("nb-repeater-disclose");
  root.remove();
});

const RICH_TEXT = `
  <fieldset id="n7_custom_body" class="nb-richtext">
    <ol class="nb-richtext-blocks">
      <li id="n7_custom_body_0" class="nb-richtext-block">
        <div id="n7_custom_body_0_spans" class="nb-richtext-spans">
          <div id="n7_custom_body_0_spans_0" class="nb-richtext-span">
            <input id="n7_custom_body_0_spans_0_text" />
          </div>
          <div id="n7_custom_body_0_spans_1" class="nb-richtext-span">
            <input id="n7_custom_body_0_spans_1_text" />
          </div>
        </div>
      </li>
    </ol>
  </fieldset>`;

test("a compiler path into rich text lands focus in the span's own input", async () => {
  const root = mount(RICH_TEXT);
  expect(await focusIssueField(root, "n7", "body.0.spans.1.text", 2)).toBe("body.0.spans.1.text");
  expect(document.activeElement?.id).toBe("n7_custom_body_0_spans_1_text");
  root.remove();
});

test("a path with no control of its own degrades to the span's row, not the fieldset", async () => {
  const root = mount(RICH_TEXT);
  expect(await focusIssueField(root, "n7", "body.0.spans.1.marks.0", 2)).toBe("body.0.spans.1");
  expect(document.activeElement?.id).toBe("n7_custom_body_0_spans_1");
  root.remove();
});

test("rich text behind a closed repeater row is opened first, then the span focused", async () => {
  const root = mount(`
    <fieldset id="n7_custom_items" class="nb-repeater">
      <ul class="nb-repeater-rows">
        <li class="nb-repeater-row"><div class="nb-repeater-rowhead">
          <button class="nb-repeater-disclose" aria-expanded="false">Body</button>
        </div></li>
      </ul>
    </fieldset>`);
  const row = root.querySelector(".nb-repeater-row");
  root.querySelector("button")?.addEventListener("click", () => {
    row?.insertAdjacentHTML(
      "beforeend",
      '<fieldset id="n7_custom_items_0_body" class="nb-richtext">' +
        '<input id="n7_custom_items_0_body_0_spans_0_text" /></fieldset>',
    );
  });
  const path = "items.0.body.0.spans.0.text";
  expect(await focusIssueField(root, "n7", path, 5)).toBe(path);
  expect(document.activeElement?.id).toBe("n7_custom_items_0_body_0_spans_0_text");
  root.remove();
});

test("no path and an unaddressable path both degrade to nothing, silently", async () => {
  const root = mount('<input id="n7_custom_headline" />');
  expect(await focusIssueField(root, "n7", undefined, 2)).toBeUndefined();
  expect(await focusIssueField(root, "n7", "slots.hero", 2)).toBeUndefined();
  root.remove();
});
