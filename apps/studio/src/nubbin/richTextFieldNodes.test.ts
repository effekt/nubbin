import { RICH_TEXT_BLOCK_KINDS, RICH_TEXT_MARKS } from "@nubbin/core";
import { expect, test } from "vitest";
import { richTextFieldNodes } from "./richTextFieldNodes";

test("the reference carries core's own closed sets, so a mark added there arrives here", () => {
  const kinds = richTextFieldNodes.find((node) => node.path === "[].kind");
  const marks = richTextFieldNodes.find((node) => node.path === "[].spans[].marks[]");
  expect(kinds?.members).toEqual([...RICH_TEXT_BLOCK_KINDS]);
  expect(marks?.members).toEqual([...RICH_TEXT_MARKS]);
});

test("every reference path is rooted at the array itself", () => {
  expect(richTextFieldNodes.length).toBeGreaterThan(0);
  for (const node of richTextFieldNodes) {
    expect(node.path.startsWith("[]")).toBe(true);
  }
});
