import { NubbinIssueCode, refuse } from "@nubbin/core";
import { expect, test, vi } from "vitest";
import { home } from "../../../examples/demo/fixtures/home";
import { createDraftSaveRequestHandler } from "./createDraftSaveRequestHandler";

function request(body: unknown) {
  return new Request("http://studio.test/api/draft", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

test("passes a parsed whole-document save to the host", async () => {
  const save = vi.fn(async () => "saved" as const);
  const response = await createDraftSaveRequestHandler(save)(
    request({ route: "/", version: home }),
  );
  expect(save).toHaveBeenCalledWith("/", home);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ ok: true });
});

test("answers malformed requests before invoking the host", async () => {
  const save = vi.fn(() => "saved" as const);
  const response = await createDraftSaveRequestHandler(save)(request({ route: "/" }));
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("malformed save");
  expect(save).not.toHaveBeenCalled();
});

test("maps a missing host draft to 400", async () => {
  const response = await createDraftSaveRequestHandler(() => "missing")(
    request({ route: "/gone", version: home }),
  );
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("no draft for /gone");
});

test("returns compiler issues without treating the persisted draft as a failed request", async () => {
  const response = await createDraftSaveRequestHandler(() => {
    refuse(NubbinIssueCode.InvalidProps, "headline must be a string", "hero");
  })(request({ route: "/", version: home }));
  expect(response.status).toBe(200);
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

test("rethrows unexpected host failures", async () => {
  const failure = new Error("storage unavailable");
  const handler = createDraftSaveRequestHandler(() => {
    throw failure;
  });
  await expect(handler(request({ route: "/", version: home }))).rejects.toBe(failure);
});
