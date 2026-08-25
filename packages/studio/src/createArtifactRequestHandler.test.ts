import type { Artifact } from "@nubbin/core";
import { expect, test } from "vitest";
import { createArtifactRequestHandler } from "./createArtifactRequestHandler";

const artifact: Artifact = {
  hash: "abc123",
  route: "/pricing",
  documentId: "pricing",
  documentVersion: 2,
  blockVersions: {},
  tree: [],
  meta: { title: "Pricing" },
  compiledWith: "test",
};

test("downloads the host artifact as stable, readable JSON", async () => {
  const routes: string[] = [];
  const GET = createArtifactRequestHandler<{ slug: string }>({
    route: ({ slug }) => `/${slug}`,
    load: (route) => {
      routes.push(route);
      return artifact;
    },
  });
  const response = await GET(new Request("https://studio.test/api/artifact"), { slug: "pricing" });
  expect(routes).toEqual(["/pricing"]);
  expect(response.headers.get("content-type")).toBe("application/json");
  expect(response.headers.get("content-disposition")).toBe(
    'attachment; filename="pricing-abc123.json"',
  );
  expect(await response.json()).toEqual(artifact);
});

test("answers 404 when the host has no draft artifact", async () => {
  const GET = createArtifactRequestHandler<Promise<string>>({
    route: async (context) => `/${await context}`,
    load: async () => undefined,
  });
  const response = await GET(
    new Request("https://studio.test/api/artifact"),
    Promise.resolve("missing"),
  );
  expect(response.status).toBe(404);
  expect(await response.text()).toBe("no draft for /missing");
});
