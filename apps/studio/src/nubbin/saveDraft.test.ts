import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DocumentVersion } from "@nubbin/core";
import { NubbinError } from "@nubbin/core";
import { home } from "demo/fixtures/home";
import { beforeEach, expect, test } from "vitest";
import { compileDraft } from "./compileDraft";
import { readDraft } from "./readDraft";
import { saveDraft } from "./saveDraft";

function withHeadline(headline: unknown): DocumentVersion {
  const version = structuredClone(home);
  const hero = version.elements.hero;
  if (hero === undefined) {
    throw new Error("the home fixture lost its hero node");
  }
  hero.props = { ...hero.props, headline };
  return version;
}

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
});

test("a saved version changes what the route compiles to", () => {
  const before = compileDraft("/");
  const outcome = saveDraft("/", withHeadline("A whole-document save"));
  const hash = "missing" in outcome ? undefined : outcome.hash;
  expect(hash).not.toBe(before?.hash);
  expect(compileDraft("/")?.hash).toBe(hash);
});

test("a version the compiler refuses throws, and the draft holds it anyway", () => {
  const invalid = withHeadline(42);
  expect(() => saveDraft("/", invalid)).toThrow(NubbinError);
  expect(readDraft("/")).toEqual(invalid);
});

test("an unknown route saves nothing", () => {
  expect(saveDraft("/no-such-route", home)).toEqual({ missing: "draft" });
  expect(readDraft("/no-such-route")).toBeUndefined();
});
