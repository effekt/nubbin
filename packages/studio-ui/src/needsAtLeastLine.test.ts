import { expect, test } from "vitest";
import { needsAtLeastLine } from "./needsAtLeastLine";

test("states the lower bound as what the list needs", () => {
  expect(needsAtLeastLine(2)).toBe("This list needs at least 2.");
});
