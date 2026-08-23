import type { DocumentVersion, Node } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import type { NubbinIssue } from "./nubbinIssue.types";

/** Flags each child whose block the slot's allow list rejects. Dangling ids are another check's job. */
export function disallowedChildren(
  parent: Node,
  path: string,
  childIds: readonly string[],
  allow: readonly string[] | undefined,
  version: DocumentVersion,
): NubbinIssue[] {
  if (allow === undefined) return [];
  const issues: NubbinIssue[] = [];
  for (const childId of childIds) {
    const child = version.elements[childId];
    if (child === undefined || allow.includes(child.block)) continue;
    issues.push({
      at: childId,
      path,
      code: NubbinIssueCode.SlotNotAllowed,
      message: `"${child.block}" is not allowed in ${path} of "${parent.block}"; allowed: ${allow.join(", ")}`,
    });
  }
  return issues;
}
