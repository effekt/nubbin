import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { DocumentVersion } from "@nubbin/core";
import { draftPath } from "./draftPath";

/**
 * The demo's `save` hook: the CLI's write verbs land here, and `readDraft` is what makes the
 * next command — and the next publish — see the edit. Together they are the loop a person runs:
 * edit, then publish.
 */
export function writeDraft(route: string, version: DocumentVersion): void {
  const path = draftPath(route);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(version)}\n`);
}
