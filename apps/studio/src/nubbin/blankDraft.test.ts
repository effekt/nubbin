import { isDocumentVersionShape } from "@nubbin/studio";
import { expect, test } from "vitest";
import { blankDraft } from "./blankDraft";

test("a blank draft is a well-formed empty document named after its route", () => {
  const version = blankDraft("/spring-sale");
  expect(isDocumentVersionShape(version)).toBe(true);
  expect(version.roots).toEqual([]);
  expect(version.elements).toEqual({});
  expect(version.version).toBe(1);
  expect(version.meta.title).toBe("Spring sale");
  expect(version.createdBy).toBe("studio");
  expect(Number.isNaN(Date.parse(version.createdAt))).toBe(false);
});

test("every new page gets its own documentId", () => {
  expect(blankDraft("/a").documentId).not.toBe(blankDraft("/a").documentId);
});
