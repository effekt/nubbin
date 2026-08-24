import { expect, test } from "vitest";
import { fieldElementFor } from "./fieldElementFor";

function region(html: string): ParentNode {
  const root = document.createElement("div");
  root.innerHTML = html;
  return root;
}

test("a leaf input is found by its id whatever field type rendered it", () => {
  const root = region('<input id="n7_custom_headline" /><input id="n7_text_tagline" />');
  expect(fieldElementFor(root, "n7", "headline")?.id).toBe("n7_custom_headline");
  expect(fieldElementFor(root, "n7", "tagline")?.id).toBe("n7_text_tagline");
});

test("a segmented enum is found by the name its radios share", () => {
  const root = region('<input type="radio" name="n7_custom_tone" value="light" />');
  expect(fieldElementFor(root, "n7", "tone")?.getAttribute("value")).toBe("light");
});

test("another node's control and an unaddressed path both come back undefined", () => {
  const root = region('<input id="n8_custom_headline" />');
  expect(fieldElementFor(root, "n7", "headline")).toBeUndefined();
  expect(fieldElementFor(root, "n8", "tagline")).toBeUndefined();
});
