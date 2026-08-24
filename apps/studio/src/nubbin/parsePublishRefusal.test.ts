import { expect, test } from "vitest";
import { parsePublishRefusal } from "./parsePublishRefusal";

test("a compiler refusal yields its issues raw", () => {
  const issues = [{ code: "invalid-props", message: "expected a string", at: "n1", path: "x" }];
  expect(parsePublishRefusal(422, JSON.stringify({ ok: false, issues }))).toEqual({
    ok: false,
    issues,
  });
});

test("a plain-text refusal becomes one issue carrying the text", () => {
  expect(parsePublishRefusal(400, "no draft for /nowhere")).toEqual({
    ok: false,
    issues: [{ message: "no draft for /nowhere" }],
  });
});

test("JSON that carries no issues array is treated as text", () => {
  expect(parsePublishRefusal(500, '{"error":"boom"}')).toEqual({
    ok: false,
    issues: [{ message: '{"error":"boom"}' }],
  });
});

test("an empty body still yields a line naming the status", () => {
  expect(parsePublishRefusal(500, "")).toEqual({
    ok: false,
    issues: [{ message: "publish rejected (500)" }],
  });
});
