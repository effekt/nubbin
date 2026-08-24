import type { ArtifactStore, Catalog, DocumentVersion, Registry } from "@nubbin/core";

/**
 * How the CLI gets the document behind a route. A function rather than a record because the
 * consumer owns where documents live — a directory of fixtures, a database, an API — and a
 * record is a one-line adapter over this while the reverse is not.
 *
 * Returning `null` says the route has no document, which the CLI reports rather than guesses at.
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

/** Everything the publish path needs from a consumer, and nothing about their framework. */
export interface NubbinConfig {
  catalog: Catalog;
  /** The compile-side registry — blocks with their schemas, never the render-side one. */
  registry: Registry;
  store: ArtifactStore;
  document: DocumentLoader;
  save?: DocumentWriter;
}
