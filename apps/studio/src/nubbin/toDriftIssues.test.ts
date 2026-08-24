import { createRegistry, defineBlock } from "@nubbin/core";
import { expect, test } from "vitest";
import { z } from "zod";
import { toDriftIssues } from "./toDriftIssues";

const hero = defineBlock({
  name: "Hero",
  schema: z.object({ title: z.string() }),
  component: null,
  version: 3,
  slots: {},
});

const registry = createRegistry([hero]);

// Only the artifact's blockVersions record is read, so the fixture is exactly that record.
const blockVersions = { Hero: 1, Footer: 2 };

test("a block still registered names both versions", () => {
  const [issue] = toDriftIssues(["Hero"], blockVersions, registry);
  expect(issue?.message).toBe(
    "Hero was compiled at version 1 but is at version 3 in the running code — rolling back would render it wrong",
  );
});

test("a block the registry no longer holds is named as gone, not skipped", () => {
  const [issue] = toDriftIssues(["Footer"], blockVersions, registry);
  expect(issue?.message).toContain("Footer was compiled at version 2 but is no longer registered");
});

test("one issue per drifted block", () => {
  expect(toDriftIssues(["Hero", "Footer"], blockVersions, registry)).toHaveLength(2);
});
