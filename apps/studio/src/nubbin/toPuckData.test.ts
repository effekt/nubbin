import { home } from "demo/fixtures/home";
import { lateEdition } from "demo/fixtures/lateEdition";
import { expect, test } from "vitest";
import { toPuckData } from "./toPuckData";

test("content holds the roots in roots order", () => {
  const data = toPuckData(lateEdition);
  expect(data.content.map((component) => component.props.id)).toStrictEqual([...lateEdition.roots]);
});

test("the document's meta becomes root.props", () => {
  expect(toPuckData(home).root.props).toStrictEqual({ ...home.meta });
});

test("a nested slot reaches the data inline, in slot order", () => {
  const stack = toPuckData(lateEdition).content[0];
  const sections = stack?.props.sections;
  if (!Array.isArray(sections)) throw new Error("sections did not become an inline child array");
  expect(sections.map((section) => section.props.id)).toStrictEqual(["header", "grid", "footer"]);
});
