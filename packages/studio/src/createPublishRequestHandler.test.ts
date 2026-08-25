import { NubbinIssueCode, refuse } from "@nubbin/core";
import { expect, test } from "vitest";
import { createPublishRequestHandler } from "./createPublishRequestHandler";

const timings = { compileMs: 1, writeMs: 2, moveMs: 3 };

function request(route: string, accept?: string) {
  return new Request("http://studio.test/api/publish", {
    method: "POST",
    headers: accept === undefined ? {} : { accept },
    body: new URLSearchParams({ route }),
  });
}

function handler(publish: () => undefined | { hash: string; timings: typeof timings }) {
  return createPublishRequestHandler({
    publish,
    consumerOrigin: () => "https://site.test",
    previewPath: (route) => `/studio/preview${route}`,
  });
}

test("answers JSON callers with the live URL and publication timings", async () => {
  const response = await handler(() => ({ hash: "abc123", timings }))(
    request("/pricing", "application/json"),
  );
  expect(await response.json()).toEqual({
    ok: true,
    hash: "abc123",
    url: "https://site.test/pricing",
    timings,
  });
});

test("redirects form callers back to the host preview", async () => {
  const response = await handler(() => ({ hash: "abc123", timings }))(request("/pricing"));
  expect(response.status).toBe(303);
  expect(response.headers.get("location")).toBe(
    "http://studio.test/studio/preview/pricing?published=abc123",
  );
});

test("answers a missing draft as a client error", async () => {
  const response = await handler(() => undefined)(request("/gone"));
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("no draft for /gone");
});

test("returns compiler refusals in the editor's issue shape", async () => {
  const response = await handler(() => {
    refuse(NubbinIssueCode.InvalidProps, "headline must be a string", "hero");
  })(request("/"));
  expect(response.status).toBe(422);
  expect(await response.json()).toEqual({
    ok: false,
    issues: [
      {
        code: NubbinIssueCode.InvalidProps,
        message: "headline must be a string",
        at: "hero",
      },
    ],
  });
});
