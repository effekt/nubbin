import type { SlotConstraint } from "./block.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import type { NubbinIssue } from "./nubbinIssue.types";

/** Checks a slot's occupancy against its declared bounds, driven by data so min and max share one shape. */
export function slotBoundIssues(
  parentId: string,
  path: string,
  count: number,
  constraint: SlotConstraint,
): NubbinIssue[] {
  const { min, max } = constraint;
  const bounds = [
    {
      code: NubbinIssueCode.SlotMin,
      limit: min,
      breached: min !== undefined && count < min,
      sense: "at least",
    },
    {
      code: NubbinIssueCode.SlotMax,
      limit: max,
      breached: max !== undefined && count > max,
      sense: "at most",
    },
  ];
  return bounds
    .filter((bound) => bound.breached)
    .map((bound) => ({
      at: parentId,
      path,
      code: bound.code,
      message: `${path} holds ${count} of ${bound.sense} ${bound.limit}`,
    }));
}
