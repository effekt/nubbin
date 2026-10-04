import { describe, expect, test } from "vitest";
import { parsePlanJson } from "./parsePlanJson";
import { UsageError } from "./UsageError";

describe("parsePlanJson", () => {
  test("returns whatever the JSON holds, judged nowhere here", () => {
    expect(parsePlanJson("plan.json", '{"framework":"next"}')).toEqual({ framework: "next" });
    expect(parsePlanJson("plan.json", "42")).toBe(42);
  });

  test("text that is not JSON names the argument and carries the parser's reason", () => {
    const attempt = () => parsePlanJson("plan.json", "{");
    expect(attempt).toThrow(UsageError);
    expect(attempt).toThrow(/^plan\.json is not JSON: .+/);
  });
});
