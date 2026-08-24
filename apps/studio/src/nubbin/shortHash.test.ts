import { expect, test } from "vitest";
import { shortHash } from "./shortHash";

test("a long hash keeps its first eight characters", () => {
  expect(shortHash("4a1627269bd1c9a0f3d2")).toBe("4a162726");
});

test("a hash already short passes through whole", () => {
  expect(shortHash("4a16")).toBe("4a16");
});
