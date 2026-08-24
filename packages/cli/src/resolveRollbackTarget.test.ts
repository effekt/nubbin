import { describe, expect, test } from "vitest";
import { publishCommand } from "./publishCommand";
import { resolveRollbackTarget } from "./resolveRollbackTarget";
import { fixtureProject } from "./testing/fixtureProject";

describe("resolveRollbackTarget", () => {
  test("with no --to, the hash positional is the target and is required", async () => {
    const { config } = await fixtureProject();
    const hash = await resolveRollbackTarget(
      config,
      { positionals: ["/pricing", "abc1"] },
      "/pricing",
    );
    expect(hash).toBe("abc1");
    await expect(
      resolveRollbackTarget(config, { positionals: ["/pricing"] }, "/pricing"),
    ).rejects.toThrow(/needs a hash/);
  });

  test("refuses a hash and --to together rather than guessing which was meant", async () => {
    const { config } = await fixtureProject();
    await expect(
      resolveRollbackTarget(config, { positionals: ["/pricing", "abc1"], to: "1" }, "/pricing"),
    ).rejects.toThrow(/abc1 would be ignored/);
  });

  test("refuses a --to that is not a document version", async () => {
    const { config } = await fixtureProject();
    await expect(
      resolveRollbackTarget(config, { positionals: ["/pricing"], to: "latest" }, "/pricing"),
    ).rejects.toThrow(/latest is not one/);
  });

  test("resolves --to through history to the hash that version published as", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const hash = (await config.store.pointer("/pricing"))?.hash ?? "";
    const resolved = await resolveRollbackTarget(
      config,
      { positionals: ["/pricing"], to: "1" },
      "/pricing",
    );
    expect(resolved).toBe(hash);
  });

  test("a version never published is refused, naming the route and version", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    await expect(
      resolveRollbackTarget(config, { positionals: ["/pricing"], to: "9" }, "/pricing"),
    ).rejects.toThrow(/no publish of \/pricing at document version 9/);
  });

  test("a store keeping no history refuses --to and says to name the hash", async () => {
    const { config } = await fixtureProject();
    const { history: _history, ...store } = config.store;
    await expect(
      resolveRollbackTarget(
        { ...config, store },
        { positionals: ["/pricing"], to: "1" },
        "/pricing",
      ),
    ).rejects.toThrow(/name the hash instead/);
  });
});
