import { expect, test } from "vitest";
import { parsePublishSuccess } from "./parsePublishSuccess";

test("the contract's shape comes through with the route attached", () => {
  const body = JSON.stringify({ ok: true, hash: "abc123", url: "http://localhost:3000/" });
  expect(parsePublishSuccess("/", body)).toEqual({
    ok: true,
    route: "/",
    hash: "abc123",
    url: "http://localhost:3000/",
  });
});

test("a 2xx body that is not JSON refuses rather than fabricating a link", () => {
  expect(parsePublishSuccess("/", "<html></html>")).toEqual({
    ok: false,
    issues: [{ message: "the publish endpoint answered with an unrecognised reply" }],
  });
});

test("JSON missing the hash or url refuses the same way", () => {
  expect(parsePublishSuccess("/", JSON.stringify({ ok: true, hash: "abc123" }))).toEqual({
    ok: false,
    issues: [{ message: "the publish endpoint answered with an unrecognised reply" }],
  });
});

test("timings ride through when shaped, and degrade alone when not", () => {
  const timings = { compileMs: 12, writeMs: 3, moveMs: 45 };
  const body = JSON.stringify({ ok: true, hash: "abc123", url: "http://localhost:3000/", timings });
  expect(parsePublishSuccess("/", body)).toEqual({
    ok: true,
    route: "/",
    hash: "abc123",
    url: "http://localhost:3000/",
    timings,
  });
  const misshapen = JSON.stringify({ hash: "abc123", url: "http://x/", timings: "fast" });
  expect(parsePublishSuccess("/", misshapen)).toEqual({
    ok: true,
    route: "/",
    hash: "abc123",
    url: "http://x/",
  });
});
