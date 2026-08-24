// The first page's quickstart names what a consumer actually installs and defines.
//
// A landing page is the highest-traffic prose in the corpus and the least likely to be re-read
// when the code moves. This is the same defect the reference pages carried — a fact about the
// code, copied, that stopped being true — and the same answer: check the copy against the
// source rather than trusting a reader to notice.
//
// It cannot check that the snippets compile; they are deliberately shorter than the demo's real
// blocks, which carry shared sub-schemas and holes a first page should not open with. What it
// checks is the part that silently rots: which packages are installed, and which fields a block
// declares.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { REPO_ROOT } from "./support/repoRoot.mjs";

const read = (rel) => readFileSync(join(REPO_ROOT, rel), "utf8");
const LANDING = read("docs/README.md");

describe("the quickstart's install step", () => {
  const demo = JSON.parse(read("examples/demo/package.json"));
  const consumed = Object.keys({ ...demo.dependencies, ...demo.devDependencies })
    .filter((name) => name.startsWith("@nubbin/"))
    .sort();

  it("has something to check", () => {
    expect(consumed.length).toBeGreaterThan(3);
  });

  it("names every package a consumer of the demo installs", () => {
    expect(consumed.filter((name) => !LANDING.includes(name))).toEqual([]);
  });

  it("names no package that is not one", () => {
    const named = [...LANDING.matchAll(/@nubbin\/[a-z-]+/g)].map((match) => match[0]);
    expect([...new Set(named)].filter((name) => !consumed.includes(name))).toEqual([]);
  });
});

describe("the quickstart's block definition", () => {
  // Every key the demo's simplest block passes to `defineBlock`, which is the call the page shows.
  const real = read("examples/demo/src/blocks/Hero.block.ts");
  const fields = [...real.matchAll(/^\s{2}([a-z]+):/gm)].map((match) => match[1]).sort();

  it("has something to check", () => {
    expect(fields).toContain("name");
    expect(fields.length).toBeGreaterThan(3);
  });

  it("shows every field the real block declares", () => {
    const shown = LANDING.slice(
      LANDING.indexOf("## Define a block"),
      LANDING.indexOf("## Register"),
    );
    expect(fields.filter((field) => !shown.includes(`${field}:`))).toEqual([]);
  });
});
