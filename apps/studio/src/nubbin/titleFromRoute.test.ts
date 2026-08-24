import { expect, test } from "vitest";
import { titleFromRoute } from "./titleFromRoute";

test.each([
  ["/", "Home"],
  ["/spring-sale", "Spring sale"],
  ["/dispatches/tide-tables", "Tide tables"],
  ["/about", "About"],
  ["/a_b", "A b"],
])("derives a title from %s", (route, title) => {
  expect(titleFromRoute(route)).toBe(title);
});
