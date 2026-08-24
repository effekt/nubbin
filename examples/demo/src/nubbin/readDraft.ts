import { existsSync, readFileSync } from "node:fs";
import type { DocumentVersion } from "@nubbin/core";
import { draftPath } from "./draftPath";

/**
 * The draft for a route, or `null` when none has been saved — in which case the config falls
 * back to the fixture. Only absence is treated as "no draft": a draft that exists but cannot
 * parse throws, because serving the fixture over a corrupt draft would silently discard edits.
 */
export function readDraft(route: string): DocumentVersion | null {
  const path = draftPath(route);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as DocumentVersion;
}
