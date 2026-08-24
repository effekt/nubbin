import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { home } from "demo/fixtures/home";
import { beforeEach, expect, test } from "vitest";
import { draftFilePath } from "./draftFilePath";
import { listDraftRoutes } from "./listDraftRoutes";
import { writeDraftFile } from "./writeDraftFile";

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
});

test("a directory that does not exist yet holds no draft routes", () => {
  process.env.NUBBIN_STUDIO_DRAFTS = join(tmpdir(), "nubbin-never-written");
  expect(listDraftRoutes()).toEqual([]);
});

test("routes decode from the filenames draftFilePath wrote, nested segments included", () => {
  writeDraftFile(draftFilePath("/"), home);
  writeDraftFile(draftFilePath("/dispatches/tide-tables"), home);
  expect([...listDraftRoutes()].sort()).toEqual(["/", "/dispatches/tide-tables"]);
});

test("an in-flight temp file is not a route", () => {
  writeDraftFile(draftFilePath("/live"), home);
  writeFileSync(join(String(process.env.NUBBIN_STUDIO_DRAFTS), "%2Flive.json.99.tmp"), "{}");
  expect(listDraftRoutes()).toEqual(["/live"]);
});
