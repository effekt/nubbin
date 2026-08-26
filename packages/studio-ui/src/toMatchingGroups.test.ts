import { expect, test } from "vitest";
import { toMatchingGroups } from "./toMatchingGroups";

const groups = [
  {
    title: "Content",
    blocks: [
      { name: "Hero", description: "The opening statement of a page." },
      { name: "UpdateFeed", description: "The record of recent changes, newest first." },
    ],
  },
  { title: "Layout", blocks: [{ name: "Split", description: "Two blocks side by side." }] },
];

test("a blank query keeps every group and every block", () => {
  expect(toMatchingGroups("", groups)).toEqual(groups);
});

test("narrows each group to the matching blocks and drops an emptied group", () => {
  const matched = toMatchingGroups("newest", groups);
  expect(matched).toHaveLength(1);
  expect(matched[0]?.title).toBe("Content");
  expect(matched[0]?.blocks.map((block) => block.name)).toEqual(["UpdateFeed"]);
});

test("returns nothing when no block matches, so the caller can show the empty state", () => {
  expect(toMatchingGroups("carousel", groups)).toEqual([]);
});
