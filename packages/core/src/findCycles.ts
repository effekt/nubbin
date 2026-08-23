import type { DocumentVersion } from "./document.types";
import { findCyclesFrom } from "./findCyclesFrom";
import type { CycleState } from "./graph.types";
import type { NubbinIssue } from "./nubbinIssue.types";

/**
 * One walk per root, over a shared visiting map so a node already proven acyclic is not
 * rewalked from the next root — and so a root reached as another root's child is skipped.
 */
export function findCycles(version: DocumentVersion): NubbinIssue[] {
  const state = new Map<string, CycleState>();
  return version.roots.flatMap((root) =>
    state.has(root) ? [] : findCyclesFrom(version, root, state),
  );
}
