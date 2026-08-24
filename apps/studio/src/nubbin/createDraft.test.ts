import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NubbinError } from "@nubbin/core";
import { beforeEach, expect, test } from "vitest";
import { createDraft } from "./createDraft";
import { readDraft } from "./readDraft";

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
});

test("the created draft round-trips through readDraft as a blank page", () => {
  const outcome = createDraft("/spring-sale");
  expect(outcome).not.toHaveProperty("exists");
  expect(readDraft("/spring-sale")).toEqual(outcome);
});

test.each([["pricing"], ["/pricing/"], [""], ["/a b"]])(
  "a route core would refuse to publish is refused at creation: %o",
  (route) => {
    expect(() => createDraft(route)).toThrowError(NubbinError);
    expect(readDraft(route)).toBeUndefined();
  },
);

test("a route a fixture already covers is a conflict, and the fixture survives", () => {
  const prior = readDraft("/dispatches");
  expect(createDraft("/dispatches")).toEqual({ exists: "draft" });
  expect(readDraft("/dispatches")).toEqual(prior);
});

test("a route already created once is a conflict the second time", () => {
  createDraft("/spring-sale");
  expect(createDraft("/spring-sale")).toEqual({ exists: "draft" });
});
