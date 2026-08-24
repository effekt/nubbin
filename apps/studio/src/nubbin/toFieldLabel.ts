import type { CatalogEntry } from "@nubbin/core";
import { zodAdapter } from "@nubbin/core";
import { humanizeFieldPath } from "./humanizeFieldPath";
import { toDescribedPath } from "./toDescribedPath";

const SLOT_PREFIX = "slots.";

/**
 * An issue path as the label the author saw in the inspector. A path the block's own schema
 * describes is humanized — the inspector labelled it by this path, so the words match. A
 * slot path names the slot the same way. Anything else comes back raw: a label that cannot
 * be looked up must stay quotable, not guessed.
 */
export function toFieldLabel(
  path: string | undefined,
  entry: CatalogEntry | undefined,
): string | undefined {
  if (path === undefined || path === "") {
    return undefined;
  }
  if (path.startsWith(SLOT_PREFIX)) {
    return humanizeFieldPath(path.slice(SLOT_PREFIX.length));
  }
  if (entry !== undefined) {
    const described = new Set(zodAdapter.describe(entry.schema).map((field) => field.path));
    if (described.has(toDescribedPath(path))) {
      return humanizeFieldPath(path);
    }
  }
  return path;
}
