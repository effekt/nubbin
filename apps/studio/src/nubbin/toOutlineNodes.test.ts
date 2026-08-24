import { expect, test } from "vitest";
import { countOutlineBlocks } from "./countOutlineBlocks";
import { toOutlineNodes } from "./toOutlineNodes";

const slotsByBlock = {
  Stack: { children: {} },
  Faq: { help: { allow: ["Cta"], max: 1 } },
  Cta: {},
  Hero: {},
};

test("a nested document becomes blocks with their areas, in declaration order", () => {
  const nodes = toOutlineNodes(
    [
      {
        type: "Stack",
        props: {
          id: "stack-1",
          children: [
            { type: "Hero", props: { id: "hero-1" } },
            {
              type: "Faq",
              props: { id: "faq-1", help: [{ type: "Cta", props: { id: "cta-1" } }] },
            },
          ],
        },
      },
    ],
    slotsByBlock,
  );
  expect(nodes).toEqual([
    {
      id: "stack-1",
      type: "Stack",
      areas: [
        {
          name: "children",
          max: undefined,
          children: [
            { id: "hero-1", type: "Hero", areas: [] },
            {
              id: "faq-1",
              type: "Faq",
              areas: [
                {
                  name: "help",
                  max: 1,
                  children: [{ id: "cta-1", type: "Cta", areas: [] }],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
});

test("a declared area the document never filled still renders, empty", () => {
  const nodes = toOutlineNodes([{ type: "Faq", props: { id: "faq-1" } }], slotsByBlock);
  expect(nodes[0]?.areas).toEqual([{ name: "help", max: 1, children: [] }]);
});

test("a block the registry does not know renders with no areas rather than throwing", () => {
  const nodes = toOutlineNodes([{ type: "Rogue", props: { id: "r-1" } }], slotsByBlock);
  expect(nodes).toEqual([{ id: "r-1", type: "Rogue", areas: [] }]);
});

test("the block count includes depth and excludes areas", () => {
  const nodes = toOutlineNodes(
    [
      {
        type: "Stack",
        props: {
          id: "stack-1",
          children: [
            { type: "Hero", props: { id: "hero-1" } },
            { type: "Hero", props: { id: "hero-2" } },
          ],
        },
      },
    ],
    slotsByBlock,
  );
  expect(countOutlineBlocks(nodes)).toBe(3);
});
