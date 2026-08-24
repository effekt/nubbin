import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { home } from "demo/fixtures/home";
import { expect, test } from "vitest";
import { readDraftFile } from "./readDraftFile";
import { writeDraftFile } from "./writeDraftFile";

const freshFile = () => join(mkdtempSync(join(tmpdir(), "nubbin-drafts-")), "%2F.json");

test("a file that does not exist reads as undefined, not a throw", () => {
  expect(readDraftFile(freshFile())).toBeUndefined();
});

test("reads back exactly the version a write put there", () => {
  const filePath = freshFile();
  writeDraftFile(filePath, home);
  expect(readDraftFile(filePath)).toEqual(home);
});
