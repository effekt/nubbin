import { expect, test } from "vitest";
import { toDescribedPath } from "./toDescribedPath";

test("a numeric segment becomes the [] the description uses", () => {
  expect(toDescribedPath("items.0.title")).toBe("items[].title");
});

test("a trailing index collapses onto its array", () => {
  expect(toDescribedPath("tags.3")).toBe("tags[]");
});

test("a path with no index passes through", () => {
  expect(toDescribedPath("cta.label")).toBe("cta.label");
});
