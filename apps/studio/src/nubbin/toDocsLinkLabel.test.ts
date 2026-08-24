import { expect, test } from "vitest";
import { toDocsLinkLabel } from "./toDocsLinkLabel";

test("capitalizes the opaque key into the link text", () => {
  expect(toDocsLinkLabel("figma")).toBe("Open in Figma");
  expect(toDocsLinkLabel("storybook")).toBe("Open in Storybook");
});

test("leaves a key with no obvious casing alone past the first letter", () => {
  expect(toDocsLinkLabel("zeroheight")).toBe("Open in Zeroheight");
  expect(toDocsLinkLabel("")).toBe("Open in ");
});
