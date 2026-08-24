import { compile, type DocumentVersion, type NubbinIssue } from "@nubbin/core";
import type { NubbinConfig } from "./config.types";
import { UsageError } from "./UsageError";

/**
 * `loadDocument` in the other direction: compile the edited document, and persist it through
 * the consumer's `save` — in that order, because a command is one edit, and the state it leaves
 * behind is what the next command reads. A document that cannot compile is refused rather than
 * stored, and a config with no `save` is refused before the document is even judged: see
 * `docs/decisions/an-edited-document-goes-back-where-it-came-from.md`.
 *
 * Returns what the compile had to say without refusing, for the caller to pass on as warnings.
 */
export async function saveDocument(
  config: NubbinConfig,
  route: string,
  edited: DocumentVersion,
): Promise<readonly NubbinIssue[]> {
  if (config.save === undefined) {
    throw new UsageError(
      "the config supplies no save, so an edited document has nowhere to go — " +
        "add save(route, version) to nubbin.config",
    );
  }
  const { issues } = compile(edited, config.catalog, config.registry, route);
  await config.save(route, edited);
  return issues;
}
