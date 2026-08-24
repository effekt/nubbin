import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { home } from "demo/fixtures/home";
import { beforeEach, expect, test } from "vitest";
import { draftFilePath } from "./draftFilePath";
import { readDraft } from "./readDraft";
import { writeDraftFile } from "./writeDraftFile";

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
});

test("a route with no draft file reads its committed fixture", () => {
  expect(readDraft("/")).toBe(home);
});

test("an edited route reads its draft file instead", () => {
  const edited = { ...home, meta: { title: "Edited" } };
  writeDraftFile(draftFilePath("/"), edited);
  expect(readDraft("/")).toEqual(edited);
});

test("an unknown route reads nothing", () => {
  expect(readDraft("/no-such-route")).toBeUndefined();
});

test.each(["constructor", "__proto__", "toString"])(
  "a route named after Object.prototype's %s reads nothing",
  (route) => {
    expect(readDraft(route)).toBeUndefined();
  },
);
