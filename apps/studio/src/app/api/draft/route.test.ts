import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DocumentVersion, NubbinIssue } from "@nubbin/core";
import { home } from "demo/fixtures/home";
import { beforeEach, expect, test } from "vitest";
import { readDraft } from "../../../nubbin/readDraft";
import { POST } from "./route";

function post(body: unknown) {
  return POST(
    new Request("http://studio.test/api/draft", { method: "POST", body: JSON.stringify(body) }),
  );
}

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

test("a valid save answers ok and persists the version", async () => {
  const version = withHeadline("Saved whole");
  const response = await post({ route: "/", version });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ ok: true });
  expect(readDraft("/")).toEqual(version);
});

test("a version the compiler refuses answers its issues, and the draft holds it", async () => {
  const invalid = withHeadline(42);
  const response = await post({ route: "/", version: invalid });
  expect(response.status).toBe(200);
  const payload = (await response.json()) as { ok: boolean; issues: NubbinIssue[] };
  expect(payload.ok).toBe(false);
  expect(payload.issues[0]?.code).toBe("invalid-props");
  expect(readDraft("/")).toEqual(invalid);
});

test("an unknown route answers 400", async () => {
  const response = await post({ route: "/nope", version: home });
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("no draft for /nope");
});

test.each([null, "text", { route: "/" }, { route: "/", version: { documentId: "home" } }])(
  "the malformed body %j answers 400",
  async (body) => {
    const response = await post(body);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("malformed save");
  },
);
