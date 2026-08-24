import type { PointerMove } from "@nubbin/core";
import { historyPath } from "./historyPath";
import { readFileOrNull } from "./readFileOrNull";

/**
 * The log as it stands, oldest first — file order is append order, so no sort is needed. A
 * route that never published has no file, which reads as no moves rather than a throw.
 */
export async function fsHistory(root: string, route: string): Promise<PointerMove[]> {
  const log = await readFileOrNull(historyPath(root, route));
  if (log === null) {
    return [];
  }
  return log
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => JSON.parse(line) as PointerMove);
}
