import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DocumentVersion } from "@nubbin/core";
import { home } from "demo/fixtures/home";
import { beforeEach, expect, test } from "vitest";
import { compileDraft } from "./compileDraft";
import { draftRevision } from "./draftRevision";
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
  const outcome = saveDraft("/", withHeadline("A whole-document save"), draftRevision(home));
  const hash = "saved" in outcome ? outcome.artifact?.hash : undefined;
  expect(hash).not.toBe(before?.hash);
  expect(compileDraft("/")?.hash).toBe(hash);
});

test("a version the compiler refuses returns issues, and the draft holds it anyway", () => {
  const invalid = withHeadline(42);
  const outcome = saveDraft("/", invalid, draftRevision(home));
  expect("saved" in outcome ? outcome.issues?.[0]?.code : undefined).toBe("invalid-props");
  expect(readDraft("/")).toEqual(invalid);
});

test("an unknown route saves nothing", () => {
  expect(saveDraft("/no-such-route", home, draftRevision(home))).toEqual({ missing: "draft" });
  expect(readDraft("/no-such-route")).toBeUndefined();
});

test("a stale revision returns the current draft without overwriting it", () => {
  const local = withHeadline("Local");
  expect(saveDraft("/", local, "stale")).toEqual({
    conflict: "draft",
    revision: draftRevision(home),
    version: home,
  });
  expect(readDraft("/")).toEqual(home);
});
