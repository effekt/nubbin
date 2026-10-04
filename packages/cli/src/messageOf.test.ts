import { describe, expect, test } from "vitest";
import { messageOf } from "./messageOf";

describe("messageOf", () => {
  test("an Error is its message", () => {
    expect(messageOf(new SyntaxError("Unexpected end of JSON input"))).toBe(
      "Unexpected end of JSON input",
    );
  });

  test("anything else is printed as a string rather than as an object", () => {
    expect(messageOf("refused")).toBe("refused");
    expect(messageOf(42)).toBe("42");
    expect(messageOf(undefined)).toBe("undefined");
  });
});
