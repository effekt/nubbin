import type { FieldNode } from "@nubbin/core";
import { expect, test } from "vitest";
import { directChildFields } from "./directChildFields";

const node = (path: string): FieldNode => ({ path, kind: "string", optional: false });

test("keeps only the fields one level beneath the base path", () => {
  const fields = [node("cta"), node("cta.label"), node("cta.href"), node("cta.icon.name")];
  expect(directChildFields(fields, "cta").map((f) => f.path)).toEqual(["cta.label", "cta.href"]);
});

test("descends through a row shape without crossing into a nested array's rows", () => {
  const fields = [
    node("items[].name"),
    node("items[].tags"),
    node("items[].tags[]"),
    node("items[].tags[].label"),
  ];
  expect(directChildFields(fields, "items[]").map((f) => f.path)).toEqual([
    "items[].name",
    "items[].tags",
  ]);
});

test("comes back empty for a path with nothing beneath it", () => {
  expect(directChildFields([node("headline")], "headline")).toEqual([]);
});
