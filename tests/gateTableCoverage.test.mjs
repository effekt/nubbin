// Every suite in `tests/` has a row in the gate table, and every row names a suite that is there.
//
// `docs/contributing/gates.md` is where someone goes to learn what CI will hold them to, so a
// suite missing from it is a gate nobody knows about until it fails them. Three were added in one
// week and none reached the table.
//
// A predecessor to this was deleted in the refactor that moved gates into `tests/`: it policed a
// hand-maintained gate list against a hand-maintained table, so both sides could drift together
// and agree while being wrong. This reads the directory instead. One side is the filesystem, and
// a row can only be right or absent.
//
// It cannot check that a row *describes* its suite correctly — a row saying the opposite of what
// its test asserts passes here, and only a reader comparing them would notice.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { REPO_ROOT } from "./support/repoRoot.mjs";

const TABLE = readFileSync(join(REPO_ROOT, "docs/contributing/gates.md"), "utf8");
const suites = readdirSync(join(REPO_ROOT, "tests"))
  .filter((name) => name.endsWith(".test.mjs"))
  .sort();
const named = [...TABLE.matchAll(/`tests\/([A-Za-z]+\.test\.mjs)`/g)].map((match) => match[1]);

describe("the gate table", () => {
  it("has something to check", () => {
    expect(suites.length).toBeGreaterThan(10);
    expect(named.length).toBeGreaterThan(10);
  });

  it("names every suite in tests/", () => {
    expect(suites.filter((name) => !named.includes(name))).toEqual([]);
  });

  it("names no suite that is not there", () => {
    expect([...new Set(named)].filter((name) => !suites.includes(name))).toEqual([]);
  });
});
