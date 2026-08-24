import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, expect, test } from "vitest";
import { readDraft } from "../../../nubbin/readDraft";
import { POST } from "./route";

function post(body: unknown) {
  return POST(
    new Request("http://studio.test/api/routes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-"));
});

test("creating a route writes a blank draft the editor can read back", async () => {
  const response = await post({ route: "/spring-sale" });
  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ ok: true, route: "/spring-sale" });
  const draft = readDraft("/spring-sale");
  expect(draft?.roots).toEqual([]);
  expect(draft?.meta.title).toBe("Spring sale");
});

test("a malformed route answers 400 with the compiler's message", async () => {
  const response = await post({ route: "spring-sale" });
  expect(response.status).toBe(400);
  expect(await response.text()).toContain("a route starts at the root");
});

test("a route that already exists answers 409, fixture or prior create alike", async () => {
  expect((await post({ route: "/dispatches" })).status).toBe(409);
  await post({ route: "/spring-sale" });
  const response = await post({ route: "/spring-sale" });
  expect(response.status).toBe(409);
  expect(await response.text()).toBe("a page already lives at /spring-sale");
});

test("a body naming no route answers 400", async () => {
  expect((await post({})).status).toBe(400);
});
