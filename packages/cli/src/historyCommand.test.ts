import { describe, expect, test } from "vitest";
import { historyCommand } from "./historyCommand";
import { publishCommand } from "./publishCommand";
import { fixtureDocument } from "./testing/fixtureDocument";
import { fixtureProject } from "./testing/fixtureProject";
import { unpublishCommand } from "./unpublishCommand";

/** The pricing document edited once more — a second version, so a second, different hash. */
const pricingAtV2 = {
  ...fixtureDocument("pricing", {
    n1: { id: "n1", block: "Hero", props: { title: "New plans" } },
  }),
  version: 2,
};

describe("historyCommand", () => {
  test("a route never published is an answer, not a failure", async () => {
    const { config } = await fixtureProject();
    const outcome = await historyCommand(config, { positionals: ["/pricing"] });
    expect(outcome.code).toBe(0);
    expect(outcome.lines).toEqual(["no publish of /pricing is recorded"]);
  });

  test("lists every move newest first, with the version and time", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const first = (await config.store.pointer("/pricing"))?.hash ?? "";
    await publishCommand({ ...config, document: () => pricingAtV2 }, { positionals: ["/pricing"] });
    const second = (await config.store.pointer("/pricing"))?.hash ?? "";
    const outcome = await historyCommand(config, { positionals: ["/pricing"] });
    expect(outcome.lines).toEqual([
      expect.stringMatching(new RegExp(`^${second} \\(document v2, moved .+\\)$`)),
      expect.stringMatching(new RegExp(`^${first} \\(document v1, moved .+\\)$`)),
    ]);
  });

  test("a route taken down keeps its trail", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    await unpublishCommand(config, { positionals: ["/pricing"] });
    const outcome = await historyCommand(config, { positionals: ["/pricing"] });
    expect(outcome.lines).toHaveLength(1);
  });

  test("a store keeping no history is named, not crashed on", async () => {
    const { config } = await fixtureProject();
    const { history: _history, ...store } = config.store;
    await expect(
      historyCommand({ ...config, store }, { positionals: ["/pricing"] }),
    ).rejects.toThrow(/history\(route\)/);
  });

  test("refuses to run without a route", async () => {
    const { config } = await fixtureProject();
    await expect(historyCommand(config, { positionals: [] })).rejects.toThrow(/needs a route/);
  });
});
