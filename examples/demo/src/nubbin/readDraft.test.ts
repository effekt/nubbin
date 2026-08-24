import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { draftPath } from "./draftPath";
import { readDraft } from "./readDraft";

/** The draft directory hangs off the working directory, so each case runs in its own. */
let previousCwd: string;
let root: string;

beforeEach(() => {
  previousCwd = process.cwd();
  root = mkdtempSync(join(tmpdir(), "nubbin-read-draft-"));
  process.chdir(root);
});

afterEach(() => {
  process.chdir(previousCwd);
  rmSync(root, { recursive: true, force: true });
});

describe("readDraft", () => {
  test("a route with no draft is null, never an error", () => {
    expect(readDraft("/dispatches")).toBeNull();
  });

  test("a draft that exists but cannot parse throws, rather than hiding an edit", () => {
    const path = draftPath("/dispatches");
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, "not json");
    expect(() => readDraft("/dispatches")).toThrow();
  });
});
