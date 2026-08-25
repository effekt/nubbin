import type { CatalogEntry } from "@nubbin/core";
import { zodAdapter } from "@nubbin/core";
import { toDescribedPath } from "./toDescribedPath";

/**
 * The schema's own upper bound on the string field an issue path names, or `undefined` when
 * the path names no field, a field of another kind, or a string that declares no bound. The
 * lookup goes through `zodAdapter.describe` — the same description the inspector's bounded
 * control reads its `maxLength` from — so the dropdown and the field can never disagree on
 * where the limit sits.
 */
export function boundedStringMax(
  path: string | undefined,
  entry: CatalogEntry | undefined,
): number | undefined {
  if (path === undefined || path === "" || entry === undefined) {
    return undefined;
  }
  const described = toDescribedPath(path);
  const field = zodAdapter.describe(entry.schema).find((node) => node.path === described);
  return field?.kind === "string" ? field.maxLength : undefined;
}
