import type { Holes } from "./artifact.types";
import type { UnknownProps } from "./block.types";
import type { Catalog } from "./catalog.types";
import type { DocumentVersion } from "./document.types";
import { droppedKeyPaths } from "./droppedKeyPaths";
import { NubbinIssueCode } from "./NubbinIssueCode";
import type { NubbinIssue } from "./nubbinIssue.types";
import { partitionProps } from "./partitionProps";
import { validateNodeProps } from "./validateNodeProps";

/**
 * Validates and partitions every node's props in one pass, collecting issues instead of
 * stopping at the first, so compile can report them all together.
 *
 * `issues` are fatal — there is no artifact to make from them. `reported` are not: a key the
 * schema did not keep still leaves a valid artifact, so it travels back beside one rather than
 * refusing a publishable page or vanishing in silence.
 *
 * The comparison is against the validated value *before* partitioning, because partitioning
 * removes every hinted field into a hole — measured after it, every hole would read as a key the
 * author lost.
 */
export function resolveAllProps(
  version: DocumentVersion,
  catalog: Catalog,
): {
  resolved: Map<string, { props: UnknownProps; holes: Holes }>;
  issues: NubbinIssue[];
  reported: NubbinIssue[];
} {
  const resolved = new Map<string, { props: UnknownProps; holes: Holes }>();
  const issues: NubbinIssue[] = [];
  const reported: NubbinIssue[] = [];
  for (const node of Object.values(version.elements)) {
    const entry = catalog[node.block];
    if (entry === undefined) {
      const message = `"${node.block}" has no catalog entry, so its props cannot be validated`;
      issues.push({ code: NubbinIssueCode.UnknownBlock, message, at: node.id, path: "block" });
      continue;
    }
    const { value, issues: propIssues } = validateNodeProps(node, entry.schema);
    issues.push(...propIssues);
    if (value !== undefined) {
      for (const path of droppedKeyPaths(node.props, value)) {
        reported.push({
          code: NubbinIssueCode.UnknownProp,
          message: `"${path}" is not a field of ${node.block}, so the schema did not keep it`,
          at: node.id,
          path,
        });
      }
      resolved.set(node.id, partitionProps(value, entry.ui));
    }
  }
  return { resolved, issues, reported };
}
