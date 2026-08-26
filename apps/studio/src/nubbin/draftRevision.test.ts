import { expect, test } from "vitest";
import { home } from "../../../../examples/demo/fixtures/home";
import { draftRevision } from "./draftRevision";

test("identical drafts have one stable opaque revision", () => {
  expect(draftRevision(home)).toBe(draftRevision(structuredClone(home)));
  expect(draftRevision({ ...home, version: home.version + 1 })).not.toBe(draftRevision(home));
});
