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

/** Everything the publish path needs from a consumer, and nothing about their framework. */
export interface NubbinConfig {
  catalog: Catalog;
  /** The compile-side registry — blocks with their schemas, never the render-side one. */
  registry: Registry;
  store: ArtifactStore;
  document: DocumentLoader;
}
