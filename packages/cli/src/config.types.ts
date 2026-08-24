import type { ArtifactStore, Catalog, DocumentVersion, Registry } from "@nubbin/core";

// How the CLI gets the document behind a route. A function rather than a record because the
// consumer owns where documents live — a directory of fixtures, a database, an API — and a
// record is a one-line adapter over this while the reverse is not.
//
// Returning `null` says the route has no document, which the CLI reports rather than guesses at.
/**
 * Reads the document version a route compiles from. Every command that touches a route calls it
 * once, before anything is validated.
 *
 * @param route - The route argument as typed on the command line — `/pricing`, `/guides/[city]`.
 *   It is unvalidated at this point: `compile` judges the route, and it does so after this
 *   returns, so a loader that finds nothing for a malformed route answers `null` rather than
 *   raising about the shape.
 * @returns The version to compile, or `null` for a route with no document. Either a value or a
 *   promise of one — the CLI awaits both. `null` exits `2`, with `no document for <route>`, which
 *   is what keeps "nothing is authored here" distinct from a load that broke.
 * @throws Whatever reading the document raises. It reaches the terminal as the refusal, so a
 *   message naming what could not be read is the one a consumer sees.
 * @example
 * ```ts
 * const document: DocumentLoader = async (route) => (await db.draftFor(route)) ?? null;
 * ```
 */
export type DocumentLoader = (
  route: string,
) => DocumentVersion | null | Promise<DocumentVersion | null>;

/**
 * Where an edited document goes. `document` in the other direction, and optional for the same
 * reason `document` is a function: the consumer owns where a document lives, and one who only
 * publishes fixtures never writes one back. Absent, the editing commands refuse and name it.
 */
export type DocumentWriter = (route: string, version: DocumentVersion) => void | Promise<void>;

// Everything the publish path needs from a consumer, and nothing about their framework.
/**
 * What a `nubbin.config.ts` default-exports: what every command needs from a consumer, and
 * nothing about their framework. Build it with `defineConfig` so the fields are checked as the
 * file is written.
 *
 * `catalog`, `registry`, `store` and `document` are required, and the config file is checked
 * for their presence when it loads — a missing one names the file and the field rather than
 * surfacing as a property access inside a command. Presence is all that is checked there:
 * whether a registry is a registry is `compile`'s question, answered when a route compiles.
 * `save` is optional, and the commands that write a document back refuse by name without it.
 *
 * @example
 * ```ts
 * import { defineConfig } from "@nubbin/cli";
 * import { createFsArtifactStore } from "@nubbin/store-fs";
 * import { catalog } from "./src/nubbin/catalog";
 * import { registry } from "./src/nubbin/registry";
 * import { draftFor } from "./src/nubbin/drafts";
 *
 * export default defineConfig({
 *   catalog,
 *   registry,
 *   store: createFsArtifactStore(".nubbin"),
 *   document: async (route) => (await draftFor(route)) ?? null,
 * });
 * ```
 */
export interface NubbinConfig {
  /**
   * The serializable half of registration, keyed by block name: the schema each node's props are
   * judged by, and the `ui.fields` hints deciding which fields freeze into the artifact and which
   * become holes. `compile` reads it; a block a document names and the catalog omits is a fault.
   */
  catalog: Catalog;
  /**
   * The compile-side registry — blocks with their schemas, never the render-side one. It supplies
   * the slot constraints the structural pass judges against and the version stamped into an
   * artifact's `blockVersions`, and `check` compares it against every live route. A render-side
   * registry maps a name to a component loader and carries no schema or version, so it cannot
   * stand in here.
   */
  registry: Registry;
  /**
   * Where artifacts are written and pointers move. `publish` writes through it before pointing a
   * route, `check` reads every pointer and artifact from it, and `history` and `rollback --to`
   * need its optional `history`. `--origin` moves the pointer through the running application
   * instead, so the store still has to be reachable from the terminal — the artifact is written
   * from here either way.
   */
  store: ArtifactStore;
  /** Where documents come from. Called once per route, by every command that names one. */
  document: DocumentLoader;
  save?: DocumentWriter;
}
