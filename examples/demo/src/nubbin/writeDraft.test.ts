import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { home } from "../../fixtures/home";
import { readDraft } from "./readDraft";
import { writeDraft } from "./writeDraft";

/** The draft directory hangs off the working directory, so the round-trip runs in its own. */
let previousCwd: string;
let root: string;

beforeEach(() => {
  previousCwd = process.cwd();
  root = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
  process.chdir(root);
});

afterEach(() => {
  process.chdir(previousCwd);
  rmSync(root, { recursive: true, force: true });
});

describe("writeDraft and readDraft", () => {
  test("what save wrote is what document reads back", () => {
    writeDraft("/", home);
    expect(readDraft("/")).toEqual(home);
  });

  test("a route with no draft reads as null, which is what falls back to the fixture", () => {
    expect(readDraft("/never-edited")).toBeNull();
  });

  test("routes do not collide: a draft for one leaves the others untouched", () => {
    writeDraft("/dispatches", home);
    expect(readDraft("/dispatches/tide-tables")).toBeNull();
  });
});
