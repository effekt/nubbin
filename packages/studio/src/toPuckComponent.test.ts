import { expect, test } from "vitest";
import { lateEdition } from "../../../examples/demo/fixtures/lateEdition";
import { toPuckComponent } from "./toPuckComponent";

test("a leaf node maps block to type and keeps its props", () => {
  const footer = toPuckComponent("footer", lateEdition.elements);
  expect(footer.type).toBe("SiteFooter");
  expect(footer.props).toStrictEqual({ ...lateEdition.elements.footer?.props, id: "footer" });
});

test("a slot becomes a prop holding the children inline, in slot order", () => {
  const grid = toPuckComponent("grid", lateEdition.elements);
  const cards = grid.props.cards;
  if (!Array.isArray(cards)) throw new Error("cards did not become an inline child array");
  expect(cards.map((card) => card.props.id)).toStrictEqual([
    "card-swell",
    "card-glass",
    "card-lamp",
    "card-count",
  ]);
});

test("nesting resolves recursively through a slot of slots", () => {
  const stack = toPuckComponent("stack", lateEdition.elements);
  const sections = stack.props.sections;
  if (!Array.isArray(sections)) throw new Error("sections did not become an inline child array");
  const grid = sections.find((section) => section.props.id === "grid");
  expect(Array.isArray(grid?.props.cards)).toBe(true);
});

test("the node's own id wins over a stray id prop", () => {
  const component = toPuckComponent("n1", {
    n1: { id: "n1", block: "Card", props: { id: "stray" } },
  });
  expect(component.props.id).toBe("n1");
});

test("a dangling child id throws rather than dropping the subtree", () => {
  expect(() =>
    toPuckComponent("n1", {
      n1: { id: "n1", block: "Card", props: {}, slots: { items: ["gone"] } },
    }),
  ).toThrowError(/dangling/);
});
