import { expect, test } from "vitest";
import { liveBandSchema } from "../blocks/LiveBand.schema";
import { resolveStudioHole } from "./resolveStudioHole";

test("a LiveBand items hole resolves to a value the block's real schema accepts", async () => {
  const items = await resolveStudioHole({
    route: "/",
    nodeId: "live",
    block: "LiveBand",
    path: "items",
    spec: { revalidate: 60 },
  });
  expect(liveBandSchema.safeParse({ label: "Right now", items }).success).toBe(true);
});

test("a hole no resolver covers is a loud failure, not a silent blank", async () => {
  await expect(
    resolveStudioHole({
      route: "/",
      nodeId: "x",
      block: "Hero",
      path: "headline",
      spec: { revalidate: 60 },
    }),
  ).rejects.toThrow("no demo resolver");
});
