import { expect, test } from "vitest";
import { toPuckRootConfig } from "./toPuckRootConfig";

test("declares one field per DocumentMeta key, in the contract's order", () => {
  expect(Object.keys(toPuckRootConfig().fields ?? {})).toStrictEqual([
    "title",
    "description",
    "robots",
    "canonical",
  ]);
});

test("the description is the one multi-line field; the rest are plain text", () => {
  const fields = toPuckRootConfig().fields ?? {};
  expect(fields.description?.type).toBe("textarea");
  expect(fields.title?.type).toBe("text");
  expect(fields.robots?.type).toBe("text");
  expect(fields.canonical?.type).toBe("text");
});

test("every field carries an author-facing label", () => {
  for (const field of Object.values(toPuckRootConfig().fields ?? {})) {
    expect(typeof field.label).toBe("string");
    expect(field.label).not.toBe("");
  }
});
