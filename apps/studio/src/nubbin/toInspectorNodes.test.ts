import { home } from "demo/fixtures/home";
import { tideTables } from "demo/fixtures/tideTables";
import { heroDefaults } from "demo/src/blocks/heroDefaults";
import { catalog } from "demo/src/nubbin/catalog";
import { expect, test } from "vitest";
import { toInspectorNodes } from "./toInspectorNodes";

test("describes every node in the draft", () => {
  const nodes = toInspectorNodes(home, catalog);
  expect(Object.keys(nodes).sort()).toEqual(Object.keys(home.elements).sort());
});

test("pairs schema fields with the draft's current values", () => {
  const hero = toInspectorNodes(home, catalog).hero;
  const headline = hero?.fields.find((field) => field.path === "headline");
  expect(headline?.kind).toBe("string");
  expect(headline?.value).toBe(home.elements.hero?.props.headline);
});

test("reads nested values through dotted paths", () => {
  const hero = toInspectorNodes(home, catalog).hero;
  const label = hero?.fields.find((field) => field.path === "cta.label");
  expect(label?.value).toBe(heroDefaults.cta.label);
});

test("a node whose block the catalog lacks gets no fields rather than a throw", () => {
  const stray = {
    ...home,
    elements: { lone: { id: "lone", block: "NoSuchBlock", props: {} } },
    roots: ["lone"],
  };
  expect(toInspectorNodes(stray, catalog).lone?.fields).toEqual([]);
});

test("a rich-text field arrives as an array whose value is the whole document", () => {
  const prose = toInspectorNodes(tideTables, catalog).body;
  const body = prose?.fields.find((field) => field.path === "body");

  expect(body?.kind).toBe("array");
  expect(body?.value).toEqual(tideTables.elements.body?.props.body);
  expect(prose?.fields.map((field) => field.path)).toContain("body[].spans[].href");
});
