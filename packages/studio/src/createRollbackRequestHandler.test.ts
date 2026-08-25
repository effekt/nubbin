import { expect, test } from "vitest";
import { createRollbackRequestHandler } from "./createRollbackRequestHandler";
import type { RollbackOutcome } from "./rollbackOutcome.types";

function post(body: unknown) {
  return new Request("https://studio.test/api/rollback", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function handler(outcome: RollbackOutcome) {
  return createRollbackRequestHandler(() => outcome);
}

test("serializes a successful rollback", async () => {
  const rollback = createRollbackRequestHandler((route, hash) => ({
    status: "rolled-back",
    hash,
    url: `https://site.test${route}`,
  }));
  const response = await rollback(post({ route: "/pricing", hash: "abc123" }));
  expect(await response.json()).toEqual({
    ok: true,
    hash: "abc123",
    url: "https://site.test/pricing",
  });
});

test("names a missing artifact", async () => {
  const response = await handler({ status: "missing", hash: "absent99" })(
    post({ route: "/", hash: "absent99" }),
  );
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("no artifact absent99");
});

test("explains a route mismatch", async () => {
  const response = await handler({
    status: "route-mismatch",
    hash: "abc123",
    artifactRoute: "/",
    requestedRoute: "/pricing",
  })(post({ route: "/pricing", hash: "abc123" }));
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("abc123 was compiled for /, not /pricing");
});

test("returns compatibility refusals in the editor issue envelope", async () => {
  const issues = [{ message: "Hero changed since this artifact was compiled" }];
  const response = await handler({ status: "refused", issues })(
    post({ route: "/", hash: "abc123" }),
  );
  expect(response.status).toBe(422);
  expect(await response.json()).toEqual({ ok: false, issues });
});

test("rejects malformed input before invoking the host", async () => {
  let called = false;
  const rollback = createRollbackRequestHandler(() => {
    called = true;
    return { status: "missing", hash: "unused" };
  });
  const response = await rollback(post({ route: "/" }));
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("malformed rollback");
  expect(called).toBe(false);
});
