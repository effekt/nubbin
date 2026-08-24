import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createFsArtifactStore } from "@nubbin/store-fs";
import { home } from "demo/fixtures/home";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { compileVersion } from "../../../nubbin/compileVersion";
import { POST } from "./route";

function post(body: unknown) {
  return POST(
    new Request("http://studio.test/api/rollback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

let storeRoot: string;

beforeEach(() => {
  storeRoot = mkdtempSync(join(tmpdir(), "nubbin-store-"));
  process.env.NUBBIN_STUDIO_STORE = storeRoot;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// The pointer is not this route's file to write: it moves inside the consumer's serving
// process, through the `api/nubbin/publish` handler the stub below stands in for.
function stubPointerMove() {
  const calls: { url: string; body: string }[] = [];
  vi.stubGlobal("fetch", (url: URL, init?: RequestInit) => {
    calls.push({ url: String(url), body: String(init?.body) });
    return Promise.resolve(new Response("", { status: 200 }));
  });
  return calls;
}

test("a stored, compatible artifact moves the pointer through the origin", async () => {
  const moves = stubPointerMove();
  const artifact = compileVersion(home, "/");
  await createFsArtifactStore(storeRoot).write(artifact);
  const response = await post({ route: "/", hash: artifact.hash });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    ok: true,
    hash: artifact.hash,
    url: "http://localhost:3000/",
  });
  expect(moves[0]?.url).toBe("http://localhost:3000/api/nubbin/publish");
  expect(moves[0] === undefined ? undefined : JSON.parse(moves[0].body)).toEqual({
    route: "/",
    hash: artifact.hash,
  });
});

test("a drifted artifact is refused with issues in publish's shape, pointer untouched", async () => {
  const moves = stubPointerMove();
  const artifact = compileVersion(home, "/");
  const drifted = { ...artifact, hash: "doctored1", blockVersions: { Hero: 999 } };
  await createFsArtifactStore(storeRoot).write(drifted);
  const response = await post({ route: "/", hash: "doctored1" });
  expect(response.status).toBe(422);
  const payload = (await response.json()) as { ok: boolean; issues: { message: string }[] };
  expect(payload.ok).toBe(false);
  expect(payload.issues[0]?.message).toContain("Hero was compiled at version 999");
  expect(moves).toHaveLength(0);
});

test("an artifact compiled for another route is refused however plausible the hash", async () => {
  stubPointerMove();
  const artifact = compileVersion(home, "/");
  await createFsArtifactStore(storeRoot).write(artifact);
  const response = await post({ route: "/dispatches", hash: artifact.hash });
  expect(response.status).toBe(400);
  expect(await response.text()).toBe(`${artifact.hash} was compiled for /, not /dispatches`);
});

test("a hash the store does not hold answers 400 naming it", async () => {
  const response = await post({ route: "/", hash: "absent99" });
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("no artifact absent99");
});

test("a malformed body answers 400", async () => {
  expect((await post({ route: "/" })).status).toBe(400);
});
