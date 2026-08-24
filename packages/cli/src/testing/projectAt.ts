import { createRegistry, type DocumentVersion, defineBlock, defineCatalog } from "@nubbin/core";
import { createFsArtifactStore } from "@nubbin/store-fs";
import { z } from "zod";
import type { NubbinConfig } from "../config.types";
import { fixtureDocument } from "./fixtureDocument";

const heroSchema = z.object({ title: z.string(), rank: z.number().optional() });

const hero = defineBlock({
  name: "Hero",
  schema: heroSchema,
  component: null,
  version: 1,
  slots: {},
});

const sectionSchema = z.object({ tagline: z.string().optional() });

/** The slotted block the write commands aim at, with an `allow` narrow enough to violate. */
const section = defineBlock({
  name: "Section",
  schema: sectionSchema,
  component: null,
  version: 1,
  slots: { body: { allow: ["Hero"] } },
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
  "/sectioned": fixtureDocument(
    "sectioned",
    {
      n1: { id: "n1", block: "Section", props: {}, slots: { body: ["n2", "n3"] } },
      n2: { id: "n2", block: "Hero", props: { title: "First" } },
      n3: { id: "n3", block: "Hero", props: { title: "Second" } },
      n4: { id: "n4", block: "Section", props: {} },
      n5: { id: "n5", block: "Hero", props: { title: "Loose" } },
    },
    ["n1", "n4", "n5"],
  ),
};

/**
 * A consumer's project as the CLI meets it: two blocks, five documents, and a real store under
 * the directory given. Taking the directory as a parameter is what lets the same fixture be
 * driven in process and be written into a config file a spawned binary loads.
 *
 * `Hero` carries defaults because `add` seeds a new node from them; `Section.tagline` carries a
 * `data` hint because `set` refuses a hinted path, and a fixture without one could not watch it.
 */
export function projectAt(root: string): NubbinConfig {
  return {
    catalog: defineCatalog({
      Hero: { schema: heroSchema, defaults: { title: "Untitled" } },
      Section: {
        schema: sectionSchema,
        ui: { fields: { tagline: { data: { revalidate: 60 } } } },
      },
    }),
    registry: createRegistry([hero, section]),
    store: createFsArtifactStore(root),
    document: (route) => DOCUMENTS[route] ?? null,
  };
}
