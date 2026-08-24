import type { DocumentVersion } from "@nubbin/core";
import { outlineNode } from "./outlineNode";

/**
 * The document as a person has to read it before editing it: every id, the block it holds, and
 * the slot it sits in. Every write command addresses a node by id, and until this existed the
 * only way to learn one was to open the file the document came from.
 */
export function documentOutline(version: DocumentVersion): readonly string[] {
  if (version.roots.length === 0) return ["this document holds no blocks"];
  return version.roots.flatMap((id) => outlineNode(version, id, 0));
}
