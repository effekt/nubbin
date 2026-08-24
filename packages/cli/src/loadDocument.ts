import type { DocumentVersion } from "@nubbin/core";
import type { NubbinConfig } from "./config.types";
import { UsageError } from "./UsageError";

/**
 * The document behind a route, or a refusal naming the route. Shared by every command that reads
 * one, so "no document for this route" reads the same whether it was reached by compiling, by
 * showing the tree, or by editing a node.
 */
export async function loadDocument(config: NubbinConfig, route: string): Promise<DocumentVersion> {
  const version = await config.document(route);
  if (version === null) throw new UsageError(`no document for ${route}`);
  return version;
}
