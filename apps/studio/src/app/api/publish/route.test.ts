import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DocumentVersion, NubbinIssue } from "@nubbin/core";
import { home } from "demo/fixtures/home";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { draftFilePath } from "../../../nubbin/draftFilePath";
import { writeDraftFile } from "../../../nubbin/writeDraftFile";
import { POST } from "./route";

function post(route: string, accept?: string) {
  return POST(
    new Request("http://studio.test/api/publish", {
      method: "POST",
      headers: accept === undefined ? {} : { accept },
      body: new URLSearchParams({ route }),
    }),
  );
}

let storeRoot: string;

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
  storeRoot = mkdtempSync(join(tmpdir(), "nubbin-store-"));
  process.env.NUBBIN_STUDIO_STORE = storeRoot;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// The pointer is not this route's file to write: since #545 it moves inside the consumer's
// serving process, through the `api/nubbin/publish` handler the stub below stands in for.
// Success asserts what this route owns — the artifact the store gained, the pointer-move
// request it issued, and the reply's shape.
function stubPointerMove() {
  const calls: { url: string; body: string }[] = [];
  vi.stubGlobal("fetch", (url: URL, init?: RequestInit) => {
    calls.push({ url: String(url), body: String(init?.body) });
    return Promise.resolve(new Response("", { status: 200 }));
  });
  return calls;
}

test("a form post publishes into the store and redirects back to the preview", async () => {
  const moves = stubPointerMove();
  writeDraftFile(draftFilePath("/"), home);
  const response = await post("/");
  expect(response.status).toBe(303);
  const location = response.headers.get("location") ?? "";
  const hash = new URL(location).searchParams.get("published");
  expect(hash).toBeTruthy();
  expect(existsSync(join(storeRoot, "artifacts", `${hash}.json`))).toBe(true);
  expect(moves[0]?.url).toBe("http://localhost:3000/api/nubbin/publish");
  expect(moves[0] === undefined ? undefined : JSON.parse(moves[0].body)).toEqual({
    route: "/",
    hash,
  });
});

test("a caller asking for JSON gets the hash and the live page's URL, built server-side", async () => {
  stubPointerMove();
  writeDraftFile(draftFilePath("/"), home);
  const response = await post("/", "application/json");
  expect(response.status).toBe(200);
  const payload = (await response.json()) as {
    ok: boolean;
    hash: string;
    url: string;
    timings: Record<string, number>;
  };
  expect(payload.ok).toBe(true);
  expect(payload.url).toBe("http://localhost:3000/");
  expect(existsSync(join(storeRoot, "artifacts", `${payload.hash}.json`))).toBe(true);
  expect(Object.keys(payload.timings).sort()).toEqual(["compileMs", "moveMs", "writeMs"]);
});

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
  expect(existsSync(join(storeRoot, "artifacts"))).toBe(false);
});

test("an unknown route answers 400", async () => {
  const response = await post("/nowhere");
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("no draft for /nowhere");
});
