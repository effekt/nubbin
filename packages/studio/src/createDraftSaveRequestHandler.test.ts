import { expect, test, vi } from "vitest";
import { home } from "../../../examples/demo/fixtures/home";
import { createDraftSaveRequestHandler } from "./createDraftSaveRequestHandler";

function request(body: unknown) {
  return new Request("http://studio.test/api/draft", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const saveBody = {
  route: "/",
  version: home,
  expectedRevision: "revision-1",
};

test("passes a parsed compare-and-save request to the host", async () => {
  const save = vi.fn(async () => ({ status: "saved" as const, revision: "revision-2" }));
  const response = await createDraftSaveRequestHandler(save)(request(saveBody));
  expect(save).toHaveBeenCalledWith(saveBody);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "saved", revision: "revision-2" });
});

test("answers malformed requests before invoking the host", async () => {
  const save = vi.fn(() => ({ status: "saved" as const, revision: "revision-2" }));
  const response = await createDraftSaveRequestHandler(save)(request({ route: "/" }));
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("malformed save");
  expect(save).not.toHaveBeenCalled();
});

test("maps a missing host draft to 400", async () => {
  const response = await createDraftSaveRequestHandler(() => ({ status: "missing" }))(
    request({ ...saveBody, route: "/gone" }),
  );
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("no draft for /gone");
});

test("returns saved compiler issues without treating the persisted draft as failed", async () => {
  const issues = [{ code: "invalid-props", message: "headline must be a string", at: "hero" }];
  const response = await createDraftSaveRequestHandler(() => ({
    status: "saved",
    revision: "revision-2",
    issues,
  }))(request(saveBody));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "saved", revision: "revision-2", issues });
});

test("returns the current draft when the host detects a stale revision", async () => {
  const response = await createDraftSaveRequestHandler(() => ({
    status: "conflict",
    revision: "revision-2",
    version: home,
  }))(request(saveBody));
  expect(response.status).toBe(409);
  expect(await response.json()).toEqual({
    status: "conflict",
    revision: "revision-2",
    version: home,
  });
});

test("rethrows unexpected host failures", async () => {
  const failure = new Error("storage unavailable");
  const handler = createDraftSaveRequestHandler(() => {
    throw failure;
  });
  await expect(handler(request(saveBody))).rejects.toBe(failure);
});
