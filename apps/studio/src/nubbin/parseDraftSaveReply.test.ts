import { expect, test } from "vitest";
import { parseDraftSaveReply } from "./parseDraftSaveReply";

test("a clean compile is undefined — nothing to show", () => {
  expect(parseDraftSaveReply({ ok: true })).toBeUndefined();
});

test("a refusal becomes one line per issue", () => {
  const reply = {
    ok: false,
    issues: [
      { message: "expected a string", path: "headline" },
      { message: "slot holds too few children" },
    ],
  };
  expect(parseDraftSaveReply(reply)).toEqual([
    "headline: expected a string",
    "slot holds too few children",
  ]);
});

test("an unrecognised reply reads as a fault, never as a clean compile", () => {
  expect(parseDraftSaveReply(undefined)).toEqual([
    "the draft endpoint answered with an unrecognised reply",
  ]);
  expect(parseDraftSaveReply("ok")).toEqual([
    "the draft endpoint answered with an unrecognised reply",
  ]);
});
