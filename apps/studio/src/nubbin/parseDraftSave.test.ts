import { home } from "demo/fixtures/home";
import { expect, test } from "vitest";
import { parseDraftSave } from "./parseDraftSave";

test("accepts a complete save and carries the version through", () => {
  const body = { route: "/", version: home };
  expect(parseDraftSave(body)).toEqual(body);
});

test.each([null, "text", 7, [], { route: "/" }, { version: home }, { route: 1, version: home }])(
  "rejects %j",
  (body) => {
    expect(parseDraftSave(body)).toBeUndefined();
  },
);

test("rejects a version that is not document-shaped", () => {
  expect(parseDraftSave({ route: "/", version: { documentId: "home" } })).toBeUndefined();
});
