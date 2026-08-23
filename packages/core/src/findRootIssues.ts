import type { DocumentVersion } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import type { NubbinIssue } from "./nubbinIssue.types";

/**
 * The entry points, checked before the graph they open. A document with no roots compiles to
 * an empty tree, and a root naming no element loses its whole subtree — both silently.
 */
export function findRootIssues(version: DocumentVersion): NubbinIssue[] {
  if (version.roots.length === 0) {
    return [
      {
        at: "",
        path: "roots",
        code: NubbinIssueCode.NoRoots,
        message: "a document needs at least one root, and this one names none",
      },
    ];
  }
  return version.roots.flatMap((root) =>
    version.elements[root] === undefined
      ? [
          {
            at: root,
            path: "roots",
            code: NubbinIssueCode.DanglingChild,
            message: `root "${root}" has no matching element`,
          },
        ]
      : [],
  );
}
