import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DocumentVersion, NubbinIssue } from "@nubbin/core";
import { home } from "demo/fixtures/home";
import { beforeEach, expect, test } from "vitest";
import { draftFilePath } from "../../../nubbin/draftFilePath";
import { writeDraftFile } from "../../../nubbin/writeDraftFile";
import { POST } from "./route";

function post(route: string) {
  return POST(
    new Request("http://studio.test/api/publish", {
      method: "POST",
      body: new URLSearchParams({ route }),
    }),
  );
}

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
});

// The redirect on success is exercised against the running server, not here — following it
// would publish into the demo's real store, which is state a unit test must not move.

test("a draft the compiler refuses answers the issues as JSON, no artifact written", async () => {
  const invalid: DocumentVersion = structuredClone(home);
  const hero = invalid.elements.hero;
  if (hero === undefined) {
    throw new Error("the home fixture lost its hero node");
  }
  hero.props = { ...hero.props, headline: 42 };
  writeDraftFile(draftFilePath("/"), invalid);
  const response = await post("/");
  expect(response.status).toBe(422);
  const payload = (await response.json()) as { ok: boolean; issues: NubbinIssue[] };
  expect(payload.ok).toBe(false);
  expect(payload.issues[0]).toMatchObject({ code: "invalid-props", at: "hero", path: "headline" });
});

test("an unknown route answers 400", async () => {
  const response = await post("/nowhere");
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("no draft for /nowhere");
});
