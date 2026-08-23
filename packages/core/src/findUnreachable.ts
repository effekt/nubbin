import type { DocumentVersion } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import type { NubbinIssue } from "./nubbinIssue.types";
import { reachableIds } from "./reachableIds";

/** A node no slot reaches would be dropped silently by denormalization, so it is an error here. */
export function findUnreachable(version: DocumentVersion): NubbinIssue[] {
  const reached = reachableIds(version);
  const issues: NubbinIssue[] = [];
  for (const node of Object.values(version.elements)) {
    if (reached.has(node.id)) continue;
    issues.push({
      at: node.id,
      path: "",
      code: NubbinIssueCode.Unreachable,
      message: `no slot reaches "${node.id}" from any root`,
    });
  }
  return issues;
}
