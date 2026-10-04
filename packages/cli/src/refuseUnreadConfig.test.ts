import { describe, expect, test } from "vitest";
import { refuseUnreadConfig } from "./refuseUnreadConfig";
import { UsageError } from "./UsageError";

const run = async () => ({ lines: [], code: 0 });

describe("refuseUnreadConfig", () => {
  test("refuses --config on an entry that runs before a config exists", () => {
    const entry = { run, takes: 1, configless: true } as const;
    const bare = () => refuseUnreadConfig("init", entry, "nubbin.config.ts");
    expect(bare).toThrow(UsageError);
    expect(bare).toThrow("init runs before a config exists, so it reads no --config");
  });

  test("lets --config through to an entry that reads a config", () => {
    expect(() => refuseUnreadConfig("check", { run, takes: 0 }, "nubbin.config.ts")).not.toThrow();
  });

  test("an absent --config is refused nowhere, whatever the entry needs", () => {
    const entry = { run, takes: 1, configless: true } as const;
    expect(() => refuseUnreadConfig("init", entry, undefined)).not.toThrow();
  });
});
