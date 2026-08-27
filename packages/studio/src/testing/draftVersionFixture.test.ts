import { expect, test } from "vitest";
import { draftVersionFixture } from "./draftVersionFixture";

test("returns independent fixtures with stable identifiers", () => {
  const first = draftVersionFixture();
  const second = draftVersionFixture();
  expect(first).toEqual(second);
  expect(first).not.toBe(second);
  expect(first.documentId).toBe("contract-document");
});
