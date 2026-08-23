import type { SlotConstraint } from "./block.types";
import { disallowedChildren } from "./disallowedChildren";
import type { DocumentVersion, Node } from "./document.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import type { NubbinIssue } from "./nubbinIssue.types";
import { slotBoundIssues } from "./slotBoundIssues";

/** Checks one filled slot against its declared constraint: existence, bounds, and allow list. */
export function slotIssuesAt(
  parent: Node,
  slotName: string,
  childIds: readonly string[],
  constraint: SlotConstraint | undefined,
  version: DocumentVersion,
): NubbinIssue[] {
  const path = `slots.${slotName}`;
  if (constraint === undefined) {
    return [
      {
        at: parent.id,
        path,
        code: NubbinIssueCode.SlotNotAllowed,
        message: `"${parent.block}" declares no slot "${slotName}"`,
      },
    ];
  }
  return [
    ...slotBoundIssues(parent.id, path, childIds.length, constraint),
    ...disallowedChildren(parent, path, childIds, constraint.allow, version),
  ];
}
