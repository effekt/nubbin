import { expect, test } from "vitest";
import { pollFrames } from "./pollFrames";

test("a value the probe already has resolves without waiting a frame", async () => {
  expect(await pollFrames(() => "now", 5)).toBe("now");
});

test("a value arriving within the budget is waited for", async () => {
  let calls = 0;
  const probe = () => {
    calls += 1;
    return calls >= 3 ? "late" : undefined;
  };
  expect(await pollFrames(probe, 10)).toBe("late");
});

test("a probe that never yields resolves undefined when the frames run out", async () => {
  let calls = 0;
  const probe = () => {
    calls += 1;
    return undefined;
  };
  expect(await pollFrames(probe, 3)).toBeUndefined();
  expect(calls).toBe(4);
});
