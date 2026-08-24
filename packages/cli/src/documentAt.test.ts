import { describe, expect, test } from "vitest";
import { documentAt } from "./documentAt";
import { fixtureProject } from "./testing/fixtureProject";
import { UsageError } from "./UsageError";

describe("documentAt", () => {
  test("reads the route from the first positional and loads its document", async () => {
    const { config } = await fixtureProject();
    const { route, version } = await documentAt(config, { positionals: ["/pricing"] });
    expect(route).toBe("/pricing");
    expect(version.documentId).toBe("pricing");
  });

  test("refuses with no route at all, before asking the loader anything", async () => {
    const { config } = await fixtureProject();
    let asked = false;
    const watched = {
      ...config,
      document: (route: string) => {
        asked = true;
        return config.document(route);
      },
    };
    await expect(documentAt(watched, { positionals: [] })).rejects.toBeInstanceOf(UsageError);
    expect(asked).toBe(false);
  });

  test("ignores positionals past the route, which belong to the command", async () => {
    const { config } = await fixtureProject();
    const { route } = await documentAt(config, { positionals: ["/", "n1", "title"] });
    expect(route).toBe("/");
  });
});
