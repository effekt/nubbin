// Duplication only goes down. `pnpm dupes` fails above 1%, and a threshold read as a budget is
// how a corpus climbs to 0.99% one justified change at a time — every change under the line,
// the line crossed by whoever comes next. This holds the tree to the integers in
// `duplication.baseline.json` instead: the clones jscpd finds and the files `.jscpd.json`
// excludes, neither of which a growing denominator can hide.
//
// Both directions, so the file is a ratchet and not a high-water mark: a tree measuring *below*
// the baseline fails too, until `pnpm dupes:baseline` records the lower number. The delta is
// what a review then sees.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BASELINE, measure } from "../scripts/duplicationBaseline.mjs";

/** What is wrong with a measurement against a baseline, or nothing. */
export function ratchetProblems(baseline, measured) {
  const problems = [];
  for (const key of ["clones", "ignored"]) {
    if (measured[key] > baseline[key]) {
      problems.push(
        `${key} rose from ${baseline[key]} to ${measured[key]} — remove the duplication, not the detector`,
      );
    } else if (measured[key] < baseline[key]) {
      problems.push(
        `${key} fell from ${baseline[key]} to ${measured[key]} — run \`pnpm dupes:baseline\` so the ratchet tightens`,
      );
    }
  }
  return problems;
}

describe("the detector", () => {
  const baseline = { clones: 10, ignored: 3 };

  it("fires when clones or exclusions rise", () => {
    expect(ratchetProblems(baseline, { clones: 11, ignored: 3 })).toEqual([
      "clones rose from 10 to 11 — remove the duplication, not the detector",
    ]);
    expect(ratchetProblems(baseline, { clones: 10, ignored: 4 })[0]).toMatch(/^ignored rose/);
  });

  it("fires when the tree is better than the baseline says", () => {
    expect(ratchetProblems(baseline, { clones: 9, ignored: 3 })[0]).toMatch(/dupes:baseline/);
  });

  it("passes an exact match", () => {
    expect(ratchetProblems(baseline, { clones: 10, ignored: 3 })).toEqual([]);
  });
});

describe("the tree", () => {
  it("has no more duplication than duplication.baseline.json records", () => {
    const baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
    const measured = measure();
    expect(measured.clones + measured.ignored).toBeGreaterThan(0);
    expect(ratchetProblems(baseline, measured)).toEqual([]);
  });
});
