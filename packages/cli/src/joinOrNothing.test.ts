import { describe, expect, test } from "vitest";
import { joinOrNothing } from "./joinOrNothing";

describe("joinOrNothing", () => {
  test("a list reads comma-joined", () => {
    expect(joinOrNothing(["Application", "Components"])).toBe("Application, Components");
  });

  test("an empty list reads as the word, not as an empty string", () => {
    expect(joinOrNothing([])).toBe("nothing");
  });
});
