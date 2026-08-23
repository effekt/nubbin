import { describe, expect, test } from "vitest";
import { parseCliArgs } from "./parseCliArgs";
import { UsageError } from "./UsageError";

describe("parseCliArgs", () => {
  test("reads the command and everything positional after it", () => {
    const parsed = parseCliArgs(["rollback", "/pricing", "9f2c1a"]);
    expect(parsed.command).toBe("rollback");
    expect(parsed.args.positionals).toEqual(["/pricing", "9f2c1a"]);
  });

  test("carries the origin to the command that publishes through it", () => {
    const parsed = parseCliArgs(["publish", "/pricing", "--origin", "http://localhost:3000"]);
    expect(parsed.args.origin).toBe("http://localhost:3000");
    expect(parsed.args.positionals).toEqual(["/pricing"]);
  });

  test("keeps the config path away from the commands, which have no use for it", () => {
    const parsed = parseCliArgs(["status", "--config", "apps/web/nubbin.config.ts"]);
    expect(parsed.configPath).toBe("apps/web/nubbin.config.ts");
    expect(parsed.args.positionals).toEqual([]);
  });

  test("reports no command when there is none, rather than inventing one", () => {
    expect(parseCliArgs([]).command).toBeUndefined();
  });

  test("refuses a flag it does not know, so a typo never runs the wrong publish", () => {
    expect(() => parseCliArgs(["publish", "/pricing", "--orgin", "x"])).toThrow(UsageError);
  });
});
