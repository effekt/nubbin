import { expect, test } from "vitest";
import { parseDraftSaveReply } from "./parseDraftSaveReply";

test("a clean compile is undefined — nothing to show", () => {
  expect(parseDraftSaveReply({ ok: true })).toBeUndefined();
});

test("a refusal hands its issues on, raw, for the editor to translate", () => {
  const issues = [
    { message: "expected a string", at: "n1", path: "headline" },
    { message: "slot holds too few children", at: "n2", path: "slots.items" },
  ];
  expect(parseDraftSaveReply({ ok: false, issues })).toEqual(issues);
});

test("a refusal carrying no issues array is an empty list", () => {
  expect(parseDraftSaveReply({ ok: false })).toEqual([]);
});

test("an unrecognised reply reads as a fault, never as a clean compile", () => {
  const fault = [{ message: "the draft endpoint answered with an unrecognised reply" }];
  expect(parseDraftSaveReply(undefined)).toEqual(fault);
  expect(parseDraftSaveReply("ok")).toEqual(fault);
});
