import { createRegistry, type DocumentVersion, defineBlock, defineCatalog } from "@nubbin/core";
import { createFsArtifactStore } from "@nubbin/store-fs";
import { z } from "zod";
import type { NubbinConfig } from "../config.types";
import { fixtureDocument } from "./fixtureDocument";

const heroSchema = z.object({ title: z.string() });

const hero = defineBlock({
  name: "Hero",
  schema: heroSchema,
  component: null,
  version: 1,
  slots: {},
});

const DOCUMENTS: Record<string, DocumentVersion> = {
  "/": fixtureDocument("home", { n1: { id: "n1", block: "Hero", props: { title: "Home" } } }),
  "/pricing": fixtureDocument("pricing", {
    n1: { id: "n1", block: "Hero", props: { title: "Plans" } },
  }),
  "/unknown-block": fixtureDocument("broken", { n1: { id: "n1", block: "Ghost", props: {} } }),
  "/extra-prop": fixtureDocument("extra", {
    n1: { id: "n1", block: "Hero", props: { title: "Extra", subtitle: "not in the schema" } },
  }),
};

/**
 * A consumer's project as the CLI meets it: one block, four documents, and a real store under
 * the directory given. Taking the directory as a parameter is what lets the same fixture be
 * driven in process and be written into a config file a spawned binary loads.
 */
export function projectAt(root: string): NubbinConfig {
  return {
    catalog: defineCatalog({ Hero: { schema: heroSchema } }),
    registry: createRegistry([hero]),
    store: createFsArtifactStore(root),
    document: (route) => DOCUMENTS[route] ?? null,
  };
}
