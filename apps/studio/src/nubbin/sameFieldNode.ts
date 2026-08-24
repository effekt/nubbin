import type { FieldNode } from "@nubbin/core";

/** Whether two described fields say the same thing — path, kind, optionality, members and
 * every declared bound — so a shape comparison never mistakes a near-miss for a match. */
export function sameFieldNode(a: FieldNode, b: FieldNode): boolean {
  return (
    a.path === b.path &&
    a.kind === b.kind &&
    a.optional === b.optional &&
    String(a.members) === String(b.members) &&
    a.maxLength === b.maxLength &&
    a.minItems === b.minItems &&
    a.maxItems === b.maxItems
  );
}
