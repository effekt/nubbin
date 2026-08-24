// A reference page may not declare a symbol the generated reference already declares.
//
// Restatement is the drift this corpus actually suffered. `compile.md` declared `): Artifact;`
// against a function returning `CompileResult`; `blocks.md` listed a `status` field `Block` has
// never had; `catalog.md` published `label` and `control` members `FieldHint` does not declare,
// and repeated the claim in a table after the interface listing was fixed. Every one was a copy
// of a fact the source already carried.
//
// `.claude/rules/documentation.md` names the rule — never restate what a tool enforces — and
// TypeDoc is now the tool: it writes every signature into `docs/reference/generated/` from the
// declarations themselves. A page that argues why the two passes exist cannot drift. A page that
// repeats the signature can, and nothing else here would notice: the generated pages are
// gitignored, so `proseDuplication` cannot see a hand-written page re-copying them.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { REPO_ROOT } from "./support/repoRoot.mjs";
import { trackedFiles } from "./support/trackedFiles.mjs";

const REFERENCE = /^---[\s\S]*?\bstatus:\s*reference\b[\s\S]*?---/;
const DECLARES =
  /^\s*(?:export\s+)?(?:declare\s+)?(?:function|interface|type|class|enum)\s+([A-Za-z_$][\w$]*)/;

/** Every symbol any package declares as an export — what the generated reference covers. */
function generatedSymbols(root) {
  const found = new Set();
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
    );
  for (const pkg of readdirSync(join(root, "packages"))) {
    for (const file of walk(join(root, "packages", pkg, "src"))) {
      if (!file.endsWith(".ts") || file.endsWith(".test.ts")) continue;
      for (const [, name] of readFileSync(file, "utf8").matchAll(
        /^export\s+(?:async\s+)?(?:declare\s+)?(?:function|const|class|type|interface|enum)\s+([A-Za-z_$][\w$]*)/gm,
      )) {
        found.add(name);
      }
    }
  }
  return found;
}

/** Symbols a page re-declares inside a `ts` fence, or [] where it declares none. */
export function restatedSymbols(text, symbols) {
  const restated = [];
  let inFence = false;
  for (const line of text.split("\n")) {
    if (/^```/.test(line)) {
      inFence = /^```ts\b/.test(line.trim());
      continue;
    }
    if (!inFence) continue;
    const match = DECLARES.exec(line);
    if (match && symbols.has(match[1])) restated.push(match[1]);
  }
  return restated;
}

describe("the detector", () => {
  const symbols = new Set(["compile", "Artifact"]);

  it("fails a fence declaring a symbol the generated reference covers", () => {
    const page = "```ts\nfunction compile(version: DocumentVersion): Artifact;\n```\n";
    expect(restatedSymbols(page, symbols)).toEqual(["compile"]);
  });

  it("fails an interface the generated reference covers", () => {
    expect(
      restatedSymbols("```ts\ninterface Artifact {\n  hash: string;\n}\n```\n", symbols),
    ).toEqual(["Artifact"]);
  });

  it("passes a worked example that calls rather than declares", () => {
    const page =
      '```ts\nconst { artifact } = compile(version, catalog, registry, "/pricing");\n```\n';
    expect(restatedSymbols(page, symbols)).toEqual([]);
  });

  it("passes a declaration outside a ts fence", () => {
    expect(restatedSymbols("Prose naming `compile` and its shape.\n", symbols)).toEqual([]);
  });

  it("passes a fence in another language", () => {
    expect(restatedSymbols("```bash\nfunction compile() {}\n```\n", symbols)).toEqual([]);
  });
});

describe("every reference page", () => {
  it("links to the generated declaration rather than repeating it", () => {
    const symbols = generatedSymbols(REPO_ROOT);
    expect(symbols.size).toBeGreaterThan(50);

    const pages = trackedFiles(REPO_ROOT)
      .filter((path) => path.startsWith("docs/reference/") && path.endsWith(".md"))
      .filter((path) => REFERENCE.test(readFileSync(join(REPO_ROOT, path), "utf8")));
    expect(pages.length).toBeGreaterThan(5);

    const offenders = pages.flatMap((path) =>
      restatedSymbols(readFileSync(join(REPO_ROOT, path), "utf8"), symbols).map(
        (name) => `${path}  redeclares ${name}`,
      ),
    );
    expect(offenders).toEqual([]);
  });
});
