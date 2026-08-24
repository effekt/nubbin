import { describe, expect, test } from "vitest";
import { linkNoteLine } from "./linkNoteLine";

describe("linkNoteLine", () => {
  test("says what would make the value a link, not that it failed", () => {
    expect(linkNoteLine()).toBe(
      "Not a link yet — use a full https:// address or a path starting with /.",
    );
  });
});
