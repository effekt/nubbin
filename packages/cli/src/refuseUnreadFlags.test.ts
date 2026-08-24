import { describe, expect, test } from "vitest";
import { refuseUnreadFlags } from "./refuseUnreadFlags";
import { UsageError } from "./UsageError";

const run = async () => ({ lines: [], code: 0 });

describe("refuseUnreadFlags", () => {
  test.each([
    ["origin", { origin: "http://x" }],
    ["to", { to: "3" }],
    ["parent", { parent: "n1" }],
    ["slot", { slot: "body" }],
    ["index", { index: 0 }],
  ] as const)("refuses --%s on a command that reads nothing of the kind", (flag, given) => {
    const bare = () => refuseUnreadFlags("verb", { run, takes: 1 }, { positionals: [], ...given });
    expect(bare).toThrow(UsageError);
    expect(bare).toThrow(new RegExp(`verb .*--${flag}`));
  });

  test("lets every flag through on an entry that reads it", () => {
    const entry = { run, takes: 2, moves: true, resolves: true, places: true };
    const args = {
      positionals: [],
      origin: "http://x",
      to: "3",
      parent: "n1",
      slot: "body",
      index: 0,
    };
    expect(() => refuseUnreadFlags("verb", entry, args)).not.toThrow();
  });

  test("absent flags are refused nowhere, whatever the entry reads", () => {
    expect(() => refuseUnreadFlags("verb", { run, takes: 0 }, { positionals: [] })).not.toThrow();
  });
});
