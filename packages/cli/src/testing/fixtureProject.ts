import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
 * A consumer's project as the CLI meets it: one block, four documents, and a real store in a
 * temporary directory. The store is real rather than a double because publishing is IO — a
 * command that writes an artifact and then moves a pointer is only proven by a store that keeps
 * both, in that order.
 */
export async function fixtureProject(): Promise<{ config: NubbinConfig; root: string }> {
  const root = await mkdtemp(join(tmpdir(), "nubbin-cli-project-"));
  return {
    root,
    config: {
      catalog: defineCatalog({ Hero: { schema: heroSchema } }),
      registry: createRegistry([hero]),
      store: createFsArtifactStore(root),
      document: (route) => DOCUMENTS[route] ?? null,
    },
  };
}
