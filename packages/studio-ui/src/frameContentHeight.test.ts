import { expect, test } from "vitest";
import { frameContentHeight } from "./frameContentHeight";

test("a detached iframe has no document to measure", () => {
  const frame = document.createElement("iframe");
  expect(frameContentHeight(frame)).toBeUndefined();
});

test("an unlaid-out document reads as unmeasured, never as zero height", () => {
  const frame = document.createElement("iframe");
  document.body.appendChild(frame);
  // happy-dom attaches an empty same-origin document whose scrollHeight is 0 — exactly the
  // moment this unit must answer "not yet" rather than "zero".
  expect(frameContentHeight(frame)).toBeUndefined();
  frame.remove();
});
