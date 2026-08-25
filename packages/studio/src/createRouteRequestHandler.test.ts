import { NubbinIssueCode, refuse } from "@nubbin/core";
import { expect, test, vi } from "vitest";
import { createRouteRequestHandler } from "./createRouteRequestHandler";

function request(body: unknown) {
  return new Request("http://studio.test/api/routes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("passes a parsed route to the host operation", async () => {
  const create = vi.fn(() => "created" as const);
  const response = await createRouteRequestHandler(create)(request({ route: "/spring-sale" }));
  expect(create).toHaveBeenCalledWith("/spring-sale");
  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ ok: true, route: "/spring-sale" });
});

test("answers malformed requests before invoking the host", async () => {
  const create = vi.fn(() => "created" as const);
  const response = await createRouteRequestHandler(create)(request({}));
  expect(response.status).toBe(400);
  expect(await response.text()).toBe("malformed create");
  expect(create).not.toHaveBeenCalled();
});

test("maps a host conflict to 409", async () => {
  const response = await createRouteRequestHandler(() => "exists")(request({ route: "/existing" }));
  expect(response.status).toBe(409);
  expect(await response.text()).toBe("a page already lives at /existing");
});

test("exposes core validation refusals but rethrows unexpected host failures", async () => {
  const refusal = createRouteRequestHandler(() => {
    refuse(NubbinIssueCode.InvalidRoute, "invalid route");
  });
  expect((await refusal(request({ route: "bad" }))).status).toBe(400);

  const failure = new Error("storage unavailable");
  const broken = createRouteRequestHandler(() => {
    throw failure;
  });
  await expect(broken(request({ route: "/new" }))).rejects.toBe(failure);
});
