import { describe, expect, test } from "vitest";
import { plural } from "./plural";

describe("plural", () => {
  test("leaves a noun alone when there is one of it", () => {
    expect(plural(1, "time")).toBe("time");
  });

  test("adds an s for none and for many", () => {
    expect(plural(0, "time")).toBe("times");
    expect(plural(4, "time")).toBe("times");
  });
});
