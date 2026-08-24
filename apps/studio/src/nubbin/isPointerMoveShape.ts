import type { PointerMove } from "@nubbin/core";

/** Judges a value off the wire as a pointer move, member by member — the history reply
 * crossed a network boundary, so each row's shape is checked rather than trusted. */
export function isPointerMoveShape(value: unknown): value is PointerMove {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const move = value as Record<string, unknown>;
  return (
    typeof move.hash === "string" &&
    typeof move.documentVersion === "number" &&
    typeof move.movedAt === "string"
  );
}
