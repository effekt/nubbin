import type { Registry } from "@nubbin/core";

/**
 * A rollback verdict's drifted block names as issues the editor's translation renders: one
 * message per block, naming the version the artifact's `blockVersions` was compiled against
 * and the one the running code registers now — or its absence, since a deleted block is
 * drift too. The author reads why the swap was refused, not just that it was.
 */
export function toDriftIssues(
  drifted: readonly string[],
  blockVersions: Record<string, number>,
  registry: Registry,
): { message: string }[] {
  return drifted.map((name) => {
    const live = registry.get(name)?.version;
    const now =
      live === undefined ? "is no longer registered" : `is at version ${live} in the running code`;
    return {
      message: `${name} was compiled at version ${blockVersions[name]} but ${now} — rolling back would render it wrong`,
    };
  });
}
