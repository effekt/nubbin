import type { Catalog, DocumentVersion } from "@nubbin/core";
import type { Command, CommandArgs } from "./command.types";
import { documentAt } from "./documentAt";
import { outcomeOf } from "./outcomeOf";
import { saveDocument } from "./saveDocument";

/**
 * One edit: everything it can read — the document, where it lives, and the catalog judging
 * it — and what it hands back: the document it produced, and the line saying what changed.
 */
export type DocumentEdit = (context: {
  catalog: Catalog;
  args: CommandArgs;
  version: DocumentVersion;
  route: string;
}) => {
  edited: DocumentVersion;
  changed: string;
};

/**
 * The shape every write verb shares: load the route's document, apply one edit, and hand the
 * result to `saveDocument` — which compiles it, refuses one that cannot compile, and persists
 * through the consumer's `save`. The verbs differ only in the operation they apply, so the
 * paragraph lives here once rather than four times.
 */
export function editingCommand(edit: DocumentEdit): Command {
  return async (config, args) => {
    const loaded = await documentAt(config, args);
    const { edited, changed } = edit({ ...loaded, args, catalog: config.catalog });
    return outcomeOf(changed, await saveDocument(config, loaded.route, edited));
  };
}
