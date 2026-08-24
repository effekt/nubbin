import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NubbinError } from "@nubbin/core";
import { home } from "demo/fixtures/home";
import { beforeEach, expect, test } from "vitest";
import { commitDraftEdit } from "./commitDraftEdit";
import { compileDraft } from "./compileDraft";
import { readDraft } from "./readDraft";

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
});

test("a committed edit changes what the route compiles to", () => {
  const before = compileDraft("/");
  const outcome = commitDraftEdit("/", "hero", "headline", "A new headline");
  const hash = "missing" in outcome ? undefined : outcome.hash;
  expect(hash).not.toBe(before?.hash);
  expect(compileDraft("/")?.hash).toBe(hash);
});

test("edits accumulate: a second commit keeps the first", () => {
  commitDraftEdit("/", "hero", "headline", "First");
  commitDraftEdit("/", "hero", "eyebrow", "Second");
  const draft = readDraft("/");
  expect(draft?.elements.hero?.props.headline).toBe("First");
  expect(draft?.elements.hero?.props.eyebrow).toBe("Second");
});

test("an edit that fails validation throws and keeps nothing", () => {
  expect(() => commitDraftEdit("/", "hero", "cta.href", 7)).toThrow(NubbinError);
  expect(readDraft("/")).toBe(home);
});

test("an unknown route commits nothing", () => {
  expect(commitDraftEdit("/no-such-route", "hero", "headline", "x")).toEqual({
    missing: "draft",
  });
});

test("an unknown node commits nothing and keeps the draft untouched", () => {
  expect(commitDraftEdit("/", "nope", "headline", "x")).toEqual({ missing: "node" });
  expect(readDraft("/")).toBe(home);
});
