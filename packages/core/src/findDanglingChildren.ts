import type { DocumentVersion } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import type { NubbinIssue } from "./nubbinIssue.types";
import { slotEdges } from "./slotEdges";
import { toIssue } from "./toIssue";

/** A slot referencing an id with no element would silently vanish at denormalization. */
export function findDanglingChildren(version: DocumentVersion): NubbinIssue[] {
  const issues: NubbinIssue[] = [];
  for (const node of Object.values(version.elements)) {
    for (const edge of slotEdges(node)) {
      if (version.elements[edge.childId] === undefined) {
        issues.push(
          toIssue(
            NubbinIssueCode.DanglingChild,
            `child "${edge.childId}" has no matching element`,
            node.id,
            `slots.${edge.slot}`,
          ),
        );
      }
    }
  }
  return issues;
}
