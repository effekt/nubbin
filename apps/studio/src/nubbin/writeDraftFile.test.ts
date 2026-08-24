import { mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { home } from "demo/fixtures/home";
import { expect, test } from "vitest";
import { readDraftFile } from "./readDraftFile";
import { writeDraftFile } from "./writeDraftFile";

const freshDir = () => mkdtempSync(join(tmpdir(), "nubbin-drafts-"));

test("creates the directory it writes into", () => {
  const filePath = join(freshDir(), "deeper", "%2F.json");
  writeDraftFile(filePath, home);
  expect(readDraftFile(filePath)).toEqual(home);
});

test("a second write overwrites the first — the slot keeps no history", () => {
  const dir = freshDir();
  const filePath = join(dir, "%2F.json");
  writeDraftFile(filePath, home);
  const edited = { ...home, meta: { title: "Edited" } };
  writeDraftFile(filePath, edited);
  expect(readDraftFile(filePath)).toEqual(edited);
  expect(readdirSync(dir)).toEqual(["%2F.json"]);
});
