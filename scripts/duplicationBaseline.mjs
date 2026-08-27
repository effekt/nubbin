#!/usr/bin/env node

// Measures duplication the way `pnpm dupes` does and writes what it found to
// `duplication.baseline.json`, which `tests/duplicationRatchet.test.mjs` holds the tree to.
//
// The threshold in `.jscpd.json` is a ceiling on a ratio, and a ratio invites "still under the
// line". This records two integers instead — the clones jscpd found and the files `.jscpd.json`
// excludes — and the test refuses either going up. It also refuses the baseline standing above
// what the tree measures, so the file only ever moves down: run this after removing duplication,
// never before adding it.
//
// Usage: node scripts/duplicationBaseline.mjs

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const BASELINE = join(ROOT, "duplication.baseline.json");

/** The directories `pnpm dupes` scans, read from the script rather than restated. */
function scannedDirectories() {
  const { scripts } = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  return scripts.dupes.replace(/^jscpd\s+/, "").split(/\s+/);
}

/** What jscpd measures on this tree, and how many files its config tells it not to look at. */
export function measure() {
  const out = mkdtempSync(join(tmpdir(), "jscpd-"));
  try {
    execFileSync(
      "pnpm",
      [
        "exec",
        "jscpd",
        ...scannedDirectories(),
        "--reporters",
        "json",
        "--output",
        out,
        "--silent",
      ],
      // jscpd exits 1 above its own threshold; the report is written either way, and the
      // verdict here is the ratchet's, not the threshold's.
      { cwd: ROOT, stdio: "ignore" },
    );
  } catch {
    // Above the threshold jscpd exits 1 with the report already written; the counts are what matter.
  }
  const report = JSON.parse(readFileSync(join(out, "jscpd-report.json"), "utf8"));
  rmSync(out, { recursive: true, force: true });
  const config = JSON.parse(readFileSync(join(ROOT, ".jscpd.json"), "utf8"));
  const { clones, percentage } = report.statistics.total;
  return { clones, ignored: config.ignore.length, percentage: Number(percentage.toFixed(2)) };
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const measured = measure();
  writeFileSync(BASELINE, `${JSON.stringify(measured, null, 2)}\n`);
  console.log(`✅ duplication.baseline.json: ${JSON.stringify(measured)}`);
}
