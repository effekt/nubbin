import type { PointerMove } from "@nubbin/core";
import type { HistoryReply } from "./historyReply.types";

/** Judges history JSON before it reaches the editor. */
export function parseHistoryHttpReply(body: string): HistoryReply | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return undefined;
  }
  if (typeof parsed !== "object" || parsed === null) return undefined;
  const { current, moves, total } = parsed as Record<string, unknown>;
  if (current !== null && typeof current !== "string") return undefined;
  if (typeof total !== "number" || (moves !== null && !Array.isArray(moves))) return undefined;
  if (
    Array.isArray(moves) &&
    !moves.every(
      (move): move is PointerMove =>
        typeof move === "object" &&
        move !== null &&
        "hash" in move &&
        typeof move.hash === "string" &&
        "documentVersion" in move &&
        typeof move.documentVersion === "number" &&
        "movedAt" in move &&
        typeof move.movedAt === "string",
    )
  ) {
    return undefined;
  }
  return { current, moves: moves as readonly PointerMove[] | null, total };
}
