import type { Node } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { overLimitIssueMessage } from "./overLimitIssueMessage";
import { overLimitLine } from "./overLimitLine";

const entry = { schema: z.object({ headline: z.string().max(60), body: z.string() }) };

function heroWith(props: Node["props"]): Node {
  return { id: "n1", block: "Hero", props };
}

test("a bounded string the draft holds past its limit gets the field's own line", () => {
  const issue = { message: "maximum 60 characters", at: "n1", path: "headline" };
  const node = heroWith({ headline: "x".repeat(92) });
  expect(overLimitIssueMessage(issue, entry, node)).toBe(overLimitLine(60, 92));
});

test("an unbounded field, a non-string value, and a value within the bound answer undefined", () => {
  expect(
    overLimitIssueMessage(
      { message: "m", path: "body" },
      entry,
      heroWith({ body: "x".repeat(92) }),
    ),
  ).toBeUndefined();
  expect(
    overLimitIssueMessage({ message: "m", path: "headline" }, entry, heroWith({ headline: 7 })),
  ).toBeUndefined();
  expect(
    overLimitIssueMessage({ message: "m", path: "headline" }, entry, heroWith({ headline: "ok" })),
  ).toBeUndefined();
});

test("no path or no catalog entry answers undefined", () => {
  expect(overLimitIssueMessage({ message: "m" }, entry, heroWith({}))).toBeUndefined();
  expect(
    overLimitIssueMessage(
      { message: "m", path: "headline" },
      undefined,
      heroWith({ headline: "x".repeat(92) }),
    ),
  ).toBeUndefined();
});
