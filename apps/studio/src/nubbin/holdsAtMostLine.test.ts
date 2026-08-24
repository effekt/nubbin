import { expect, test } from "vitest";
import { holdsAtMostLine } from "./holdsAtMostLine";

test("states the upper bound as what the list holds", () => {
  expect(holdsAtMostLine(8)).toBe("This list holds at most 8.");
});
