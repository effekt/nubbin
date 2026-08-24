import type { PointerMove } from "@nubbin/core";
import { isPointerMoveShape } from "./isPointerMoveShape";

/**
 * The `moves` member of a history reply, judged: `null` passes through — it is how a store
 * without history answers — and a list passes only when every row is a pointer move. One bad
 * row spoils the list, because a panel showing nineteen vouched rows and one invention has no
 * way to say which is which.
 */
export function parseMoves(value: unknown): readonly PointerMove[] | null | undefined {
  if (value === null) {
    return null;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  const rows = value.filter(isPointerMoveShape);
  return rows.length === value.length ? rows : undefined;
}
