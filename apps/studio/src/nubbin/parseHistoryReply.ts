import type { HistoryReply } from "@nubbin/studio";
import { parseMoves } from "./parseMoves";

/**
 * A history reply's body judged member by member: `current` a hash or `null`, `moves` a list
 * of pointer moves or the `null` a store without history answers, `total` a count. Anything
 * else — not JSON, or JSON of another shape — is `undefined`, so the panel reports a failed
 * load rather than rendering rows it cannot vouch for.
 */
export function parseHistoryReply(body: string): HistoryReply | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return undefined;
  }
  if (typeof parsed !== "object" || parsed === null) {
    return undefined;
  }
  const { current, moves, total } = parsed as Record<string, unknown>;
  const rows = parseMoves(moves);
  if (rows === undefined || typeof total !== "number") {
    return undefined;
  }
  if (current !== null && typeof current !== "string") {
    return undefined;
  }
  return { current, moves: rows, total };
}
