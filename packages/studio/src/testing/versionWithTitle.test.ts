import { expect, test } from "vitest";
import { draftVersionFixture } from "./draftVersionFixture";
import { versionWithTitle } from "./versionWithTitle";

test("changes only the title while preserving structural identity", () => {
  const original = draftVersionFixture();
  const changed = versionWithTitle(original, "Changed");
  expect(changed.meta.title).toBe("Changed");
  expect(changed.documentId).toBe(original.documentId);
  expect(changed.elements).toBe(original.elements);
  expect(original.meta.title).toBe("Initial");
});
