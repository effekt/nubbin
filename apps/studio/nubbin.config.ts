import { join } from "node:path";
import { defineStudioConfig } from "@nubbin/studio-ui/config";
import { fixtureRoutes } from "demo/fixtures/fixtureRoutes";
import { blockRegistry } from "demo/src/nubbin/blockRegistry";
import { catalog } from "demo/src/nubbin/catalog";
import { registry } from "demo/src/nubbin/registry";
import { resolveStudioHole } from "demo/src/nubbin/resolveStudioHole";

/** The consumer binding for this deployment. Replace this file to point Studio at another app. */
const studioConfig = defineStudioConfig({
  catalog,
  registry,
  blockRegistry,
  seedDocuments: fixtureRoutes,
  resolveHole: resolveStudioHole,
  artifactStoreDir: join(process.cwd(), "..", "..", "examples", "demo", ".nubbin"),
  consumerOrigin: "http://localhost:3000",
  viewports: [
    { width: 640, height: "auto", icon: "sm", label: "sm" },
    { width: 768, height: "auto", icon: "md", label: "md" },
    { width: 1024, height: "auto", icon: "lg", label: "lg" },
    { width: 1280, height: "auto", icon: "xl", label: "xl" },
    { width: 1536, height: "auto", icon: "2xl", label: "2xl" },
  ],
});

export default studioConfig;
