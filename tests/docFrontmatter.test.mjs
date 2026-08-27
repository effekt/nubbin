// Every document beneath `docs/` carries the frontmatter `docs/CATALOG.md` quotes.
//
// The catalog is a router: an agent reads one row per page and opens the page the row names.
// A page with no `summary` reaches that table as an empty cell, which is a page nobody is routed
// to — and the reader who would notice is the one who already knows the page exists. A `keywords`
// line is optional, but when present it is the comma-separated list the row renders, so a value
// in any other shape renders as one keyword nobody would search for.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { readFrontmatter } from "../scripts/catalog.mjs";
import { REPO_ROOT } from "./support/repoRoot.mjs";
import { trackedFiles } from "./support/trackedFiles.mjs";

const REQUIRED = ["title", "summary"];

/** What is wrong with one document's frontmatter, or nothing. */
export function frontmatterProblems(rel, text) {
  const meta = readFrontmatter(text);
  const problems = REQUIRED.filter((key) => !meta[key]).map(
    (key) => `${rel}  frontmatter missing: ${key}`,
  );
  if ("keywords" in meta) {
    const terms = meta.keywords.split(",").map((term) => term.trim());
    if (terms.some((term) => term === "" || /[\s]{2,}|[|]/.test(term))) {
      problems.push(`${rel}  keywords is a comma-separated list of terms: ${meta.keywords}`);
    }
  }
  return problems;
}

const docs = trackedFiles(REPO_ROOT).filter(
  (file) => file.startsWith("docs/") && file.endsWith(".md") && !file.includes("/generated/"),
);

describe("the detector", () => {
  it("fires on a document with no summary", () => {
    expect(frontmatterProblems("a.md", "---\ntitle: A\nstatus: stable\n---\n")).toEqual([
      "a.md  frontmatter missing: summary",
    ]);
  });

  it("fires on a document with no frontmatter at all", () => {
    expect(frontmatterProblems("a.md", "# A\n")).toHaveLength(2);
  });

  it("fires on keywords that are not a list", () => {
    expect(frontmatterProblems("a.md", "---\ntitle: A\nsummary: B\nkeywords: a,,b\n---\n")).toEqual(
      ["a.md  keywords is a comma-separated list of terms: a,,b"],
    );
  });

  it("passes a well-formed document, with or without keywords", () => {
    expect(frontmatterProblems("a.md", "---\ntitle: A\nsummary: B\n---\n")).toEqual([]);
    expect(
      frontmatterProblems("a.md", "---\ntitle: A\nsummary: B\nkeywords: one, two words\n---\n"),
    ).toEqual([]);
  });
});

describe("every document beneath docs/", () => {
  it("has something to check", () => {
    expect(docs.length).toBeGreaterThan(50);
  });

  it("carries the frontmatter the catalog quotes", () => {
    const problems = docs.flatMap((rel) =>
      frontmatterProblems(rel, readFileSync(join(REPO_ROOT, rel), "utf8")),
    );
    expect(problems).toEqual([]);
  });
});
