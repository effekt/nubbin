import { describe, expect, test } from "vitest";
import { publishCommand } from "./publishCommand";
import { routeHistory } from "./routeHistory";
import { fixtureProject } from "./testing/fixtureProject";

describe("routeHistory", () => {
  test("hands back the store's moves for the route", async () => {
    const { config } = await fixtureProject();
    await publishCommand(config, { positionals: ["/pricing"] });
    const moves = await routeHistory(config, "/pricing", "it is wanted");
    expect(moves).toHaveLength(1);
    expect(moves[0]?.documentVersion).toBe(1);
  });

  test("a store keeping no history is named, with the caller's reason appended", async () => {
    const { config } = await fixtureProject();
    const { history: _history, ...store } = config.store;
    await expect(routeHistory({ ...config, store }, "/pricing", "it is wanted")).rejects.toThrow(
      /no history\(route\), so it is wanted/,
    );
  });
});
