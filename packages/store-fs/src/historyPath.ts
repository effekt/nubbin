import { join } from "node:path";
import { encodeRouteKey } from "./encodeRouteKey";

/**
 * One log per route, beside the pointer directory rather than in it: `manifest()` reads every
 * entry of `routes/` as a pointer, so a log filed there would be parsed as one and crash the
 * listing. Lines, not a JSON document — the file is appended, never read back to be rewritten.
 */
export function historyPath(root: string, route: string): string {
  const key = encodeRouteKey(route);
  return join(root, "history", `${key}.jsonl`);
}
