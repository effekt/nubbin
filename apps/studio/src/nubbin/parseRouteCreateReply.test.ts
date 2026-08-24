import { expect, test } from "vitest";
import { parseRouteCreateReply } from "./parseRouteCreateReply";

test("a created reply carries the route to navigate to", () => {
  expect(parseRouteCreateReply(true, 201, JSON.stringify({ ok: true, route: "/x" }))).toEqual({
    ok: true,
    route: "/x",
  });
});

test("a refusal's body is the message", () => {
  expect(parseRouteCreateReply(false, 409, "a page already lives at /x")).toEqual({
    ok: false,
    message: "a page already lives at /x",
  });
});

test("an empty refusal still names its status", () => {
  expect(parseRouteCreateReply(false, 500, "")).toEqual({
    ok: false,
    message: "the page was not created (500)",
  });
});

test("an ok reply whose body holds no route reads as a refusal, not a crash", () => {
  expect(parseRouteCreateReply(true, 201, "garbage").ok).toBe(false);
});
