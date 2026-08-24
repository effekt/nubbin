import type { FieldNode } from "@nubbin/core";
import { expect, test } from "vitest";
import { sameFieldNode } from "./sameFieldNode";

const base: FieldNode = { path: "[].kind", kind: "enum", optional: false, members: ["a", "b"] };

test("identical descriptions match", () => {
  expect(sameFieldNode(base, { ...base })).toBe(true);
});

test.each([
  ["path", { ...base, path: "[].type" }],
  ["kind", { ...base, kind: "string" as const }],
  ["optionality", { ...base, optional: true }],
  ["members", { ...base, members: ["a", "c"] }],
  ["a declared bound", { ...base, maxLength: 10 }],
])("a difference in %s does not match", (_what, other) => {
  expect(sameFieldNode(base, other)).toBe(false);
});
