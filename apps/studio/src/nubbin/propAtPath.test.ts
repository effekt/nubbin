import { expect, test } from "vitest";
import { propAtPath } from "./propAtPath";

test("reads a top-level and a nested value by dotted path", () => {
  const props = { headline: "hi", cta: { label: "Go" } };
  expect(propAtPath(props, "headline")).toBe("hi");
  expect(propAtPath(props, "cta.label")).toBe("Go");
});

test("a numeric segment indexes an array member", () => {
  const props = { items: [{ title: "first" }, { title: "second" }] };
  expect(propAtPath(props, "items.1.title")).toBe("second");
});

test("a path the props do not hold answers undefined rather than throwing", () => {
  expect(propAtPath({ headline: "hi" }, "cta.label")).toBeUndefined();
  expect(propAtPath({ headline: "hi" }, "headline.length.beyond")).toBeUndefined();
  expect(propAtPath(undefined, "headline")).toBeUndefined();
});
