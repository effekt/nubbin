import { expect, test } from "vitest";
import { timedMs } from "./timedMs";

test("carries the step's value through with a whole-millisecond duration", async () => {
  const { value, ms } = await timedMs(() => Promise.resolve("done"));
  expect(value).toBe("done");
  expect(Number.isInteger(ms)).toBe(true);
  expect(ms).toBeGreaterThanOrEqual(0);
});

test("a synchronous step is timed the same way", async () => {
  const { value } = await timedMs(() => 42);
  expect(value).toBe(42);
});

test("a step that waits reports at least its wait", async () => {
  const { ms } = await timedMs(() => new Promise((resolve) => setTimeout(resolve, 20)));
  expect(ms).toBeGreaterThanOrEqual(15);
});
