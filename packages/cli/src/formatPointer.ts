import type { RoutePointer } from "@nubbin/core";

/**
 * One pointer as one line: the route first because it is what a reader scans the list for, the
 * hash because it is the artifact's identity in the store, and when it moved because "how long
 * has this been live" is the question a status listing answers.
 */
export function formatPointer(pointer: RoutePointer): string {
  return `${pointer.route} -> ${pointer.hash} (moved ${pointer.updatedAt})`;
}
